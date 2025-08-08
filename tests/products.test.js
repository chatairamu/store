const request = require('supertest');
const app = require('../app');
const pool = require('../src/config/db');

// We need to close the pool after all tests are done
afterAll(() => {
  pool.end();
});

describe('Products API', () => {

  // Test for fetching all products
  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toEqual(200);
      // Expect the body to be an array (it could be empty if DB is empty)
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Test for fetching a single product
  describe('GET /api/products/:id', () => {
    it('should return a single product for a valid ID', async () => {
      // This test assumes a product with ID 1 exists in the database.
      // In a real-world scenario, you would seed the test database first.
      const res = await request(app).get('/api/products/1');

      // If product 1 exists, we expect 200, otherwise 404 is also a valid outcome for a non-seeded DB.
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name');
      } else {
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe('Product not found.');
      }
    });

    it('should return a 404 for an invalid product ID', async () => {
      // Using a very large number for an ID that likely doesn't exist.
      const res = await request(app).get('/api/products/999999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Product not found.');
    });
  });
});
