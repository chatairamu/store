<?php
// inc/helpers.php
// Helper functions for various tasks like input sanitization, etc.

/**
 * Sanitize user input to prevent XSS attacks.
 *
 * @param string $data The input data to sanitize.
 * @return string The sanitized data.
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * A simple function to format currency.
 *
 * @param float $number The number to format.
 * @param string $currency The currency symbol.
 * @return string The formatted currency string.
 */
function format_currency($number, $currency = '₹') {
    return $currency . number_format($number, 2);
}

/**
 * Redirect to a given URL.
 *
 * @param string $url The URL to redirect to.
 * @return void
 */
function redirect($url) {
    header("Location: " . $url);
    exit();
}

/**
 * Dump and die, for debugging.
 *
 * @param mixed $data The data to dump.
 * @return void
 */
function dd($data) {
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
    die();
}
?>
