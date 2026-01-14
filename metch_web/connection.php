<?php
// Database connection configuration
$host = "localhost";
$user = "root";
$pass = ""; // Leave empty if you didn’t set a password for phpMyAdmin
$db   = "metcha_db"; // Your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection status
if ($conn->connect_error) {
  die("❌ Connection failed: " . $conn->connect_error);
}

// echo "✅ Connected successfully"; // Optional test message
?>
