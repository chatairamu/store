const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

// We need to close the pool after all tests are done
afterAll(() => {
  pool.end();
});

describe('Authentication API', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    phone: '1234567890',
    password: 'password123'
  };

  // Test for User Registration
  describe('POST /api/auth/user/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/user/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail to register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/auth/user/register')
        .send(testUser); // Sending the same user data again

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toBe('An account with this email already exists.');
    });
  });

  // Test for User Login
  describe('POST /api/auth/user/login', () => {
    it('should login the user successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Invalid credentials.');
    });
  });
});
