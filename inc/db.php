<?php
// inc/db.php
// Database Configuration and Connection

// --- Database Credentials ---
// Replace with your actual database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'orugallu_biryani');

// --- PDO Connection ---
try {
    // Data Source Name (DSN)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";

    // PDO Options
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays by default
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Disable emulated prepares for security
    ];

    // Create a new PDO instance
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    // If connection fails, stop the script and show an error message.
    // In a production environment, you would log this error and show a generic message.
    die("Database connection failed: " . $e->getMessage());
}

// The $pdo object is now available for use in other files that include this one.
?>
