<?php
// Connect to the database
require 'connection.php';

// Check if verification code exists in the URL
if (isset($_GET['code'])) {
  $code = $_GET['code'];

  // Update user account to verified
  $sql = "UPDATE users SET is_verified = 1 WHERE verification_code = '$code'";

  if ($conn->query($sql) && $conn->affected_rows > 0) {
    echo "<h2>✅ Your email has been verified successfully! You can now <a href='login.html'>login</a>.</h2>";
  } else {
    echo "<h2>❌ Invalid or expired verification link.</h2>";
  }
}
?>
