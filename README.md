# Orugallu Biryani - Multi-Vendor Food Delivery & eCommerce Platform

This project is a fully-featured, multi-vendor food delivery and eCommerce platform, designed to be self-hosted. It includes vendor management, product and order systems, coupon logic, and more.

This version of the application is built using the Node.js runtime environment.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: EJS (Embedded JavaScript templates) for server-side rendering, Bootstrap 5, jQuery
- **Authentication**: JSON Web Tokens (JWT)
- **Key Libraries**:
  - `mysql2` for database connection
  - `bcryptjs` for password hashing
  - `jsonwebtoken` for JWT creation and verification
  - `dotenv` for environment variable management
  - `nodemon` for development auto-reloading

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [MySQL](https://www.mysql.com/) server (v8+)

## Installation and Setup

Follow these steps to get your local development environment set up and running.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_directory>
```

### 2. Install Dependencies

Install all the required npm packages.

```bash
npm install
```

### 3. Set Up the Database

You need to create a database in your MySQL server and then import the provided schema.

1.  Connect to your MySQL server.
2.  Create a new database. The default name used by the application is `orugallu_biryani`.
    ```sql
    CREATE DATABASE orugallu_biryani;
    ```
3.  Use the new database.
    ```sql
    USE orugallu_biryani;
    ```
4.  Import the schema from the `database.sql` file located in the root of the project.
    ```bash
    mysql -u your_mysql_user -p orugallu_biryani < database.sql
    ```

### 4. Configure Environment Variables

The application uses a `.env` file to store sensitive information like database credentials and JWT secrets.

1.  Make a copy of the example environment file.
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and fill in the required values:
    - `DB_HOST`: Your MySQL server host (e.g., `localhost`).
    - `DB_USER`: Your MySQL username.
    - `DB_PASSWORD`: Your MySQL password.
    - `DB_NAME`: The name of the database you created (`orugallu_biryani`).
    - `JWT_SECRET`: A long, random, and secret string for signing tokens.

## Running the Application

Once the setup is complete, you can run the application using one of the following scripts:

- **For development (with auto-restarting):**
  ```bash
  npm run dev
  ```
- **For production:**
  ```bash
  npm start
  ```

The server will start, and by default, it will be accessible at `http://localhost:3000`.

## API Endpoints Overview

The application provides a RESTful API for its core functionalities.

- **Authentication**: `/api/auth`
  - `POST /user/register`
  - `POST /user/login`
- **Products**: `/api/products`
  - `GET /`
  - `GET /:id`
  - `POST /` (Protected)
- **Cart**: `/api/cart` (Protected)
  - `GET /`
  - `POST /`
  - `PUT /:itemId`
  - `DELETE /:itemId`
- **Orders**: `/api/orders` (Protected)
  - `POST /`
  - `GET /`
  - `GET /:id`
- **Coupons**: `/api/coupons` (Protected)
  - `POST /apply`

Protected routes require a valid JWT to be sent in the `Authorization` header as a Bearer token.
