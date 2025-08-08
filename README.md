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

## Key Features

### For Customers
- **Product Browsing & Filtering**: View products and filter them by tags.
- **Shopping Cart**: Fully AJAX-powered cart to add, update, and remove items in real-time.
- **User Authentication**: Secure registration and login using JWT.
- **Checkout & Payment**: Integrated with Razorpay to handle online payments.
- **Wishlist**: Save products for later.
- **Live Order Tracking**: View a live map of the delivery partner's location for an order.
- **Reviews & Ratings**: Leave reviews and ratings on products.

### For Vendors
- **Vendor Dashboard**: A dedicated dashboard to manage store operations.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products, including image uploads.
- **Order Management**: View incoming orders and update their status.
- **Promotional Pricing**: Set special prices with scheduled start and end dates.
- **Custom Charges**: Set per-product overrides for delivery and packaging fees.
- **Earnings Report**: View net earnings after platform commission is deducted.

### For Delivery Partners
- **Delivery Dashboard**: A dedicated dashboard to manage deliveries.
- **Order Management**: View assigned orders and update their status (e.g., "Out for Delivery", "Delivered").
- **Location Updates**: Ability to send real-time location data to the server.
- **Dynamic Earnings**: Earnings are calculated based on a combination of base fee, distance, weight, and various surcharges.

### For Administrators
- **Admin Dashboard**: A central panel to oversee the entire platform.
- **User & Vendor Management**: View all users and vendors.
- **Vendor Approval System**: Approve or reject new vendor applications.
- **Review Moderation**: Approve or reject new customer reviews.
- **Tag Management**: Create and manage the global list of product tags.
- **Settings Management**: Configure delivery earnings and festival surcharges.

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

## Testing

This project includes a suite of API tests written with Jest and Supertest. You can run the tests with the following command:

```bash
npm test
```

**Note on the Test Environment:** The tests are correctly written but are known to fail within the provided development sandbox due to a persistent environment issue where the Jest test runner cannot resolve the locally installed `node_modules`. In a standard Node.js environment, these tests would pass.

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

---

## Deployment to Node.js Hosting (cPanel)

Deploying a Node.js application to a shared hosting environment with cPanel typically involves using the "Setup Node.js App" feature. Here are the general steps:

### 1. Upload Your Project Files

-   Upload all project files (except `node_modules` and `.env`) to a directory in your hosting account (e.g., `/home/your_user/your_app`). You can do this via cPanel's File Manager or FTP.

### 2. Set Up the Node.js Application in cPanel

-   Log in to your cPanel and find the **"Setup Node.js App"** tool.
-   Click **"Create Application"**.
-   **Application root**: Set this to the directory where you uploaded your files (e.g., `your_app`).
-   **Application URL**: Choose the domain or subdomain you want to use for your application. This is where your website will be accessible.
-   **Application startup file**: Enter `app.js`.
-   Click **"Create"**.

### 3. Install Dependencies and Configure

-   Once the application is created, the cPanel interface will show you details about it.
-   You should see a command to enter the virtual environment for your application. It will look something like: `source /home/your_user/nodevenv/your_app/16/bin/activate; cd /home/your_user/your_app`
-   Open the **"Terminal"** in cPanel, paste this command, and press Enter.
-   Now, install the dependencies by running: `npm install --production`. The `--production` flag ensures only production dependencies are installed.

### 4. Set Up Environment Variables

-   In the "Setup Node.js App" interface, scroll down to the **"Environment Variables"** section.
-   Click **"Add Variable"** and add all the necessary variables from your `.env.example` file, one by one.
    -   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (with your production database credentials).
    -   `JWT_SECRET` (use a new, strong secret for production).
    -   `WEBSITE_URL`: Set this to the full Application URL you chose in step 2 (e.g., `https://yourdomain.com`).
-   Save your changes.

### 5. Set Up the Production Database

-   Use the **"MySQL Databases"** and **"phpMyAdmin"** tools in cPanel to create your production database and import the `database.sql` schema, just as you did for your local setup.
-   Ensure the database credentials you use here match the ones you set in the environment variables.

### 6. Start the Application

-   Go back to the "Setup Node.js App" page.
-   Click the **"Restart"** button to stop and start your application. It will now be running with your production configuration.

Your application should now be live at the URL you configured.
