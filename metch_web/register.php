<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection and email function
require 'connection.php';
require 'sendEmail.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $email = $_POST["email"];
  $password = $_POST["password"];

  // Encrypt password before saving it in the database
  $hashed = password_hash($password, PASSWORD_BCRYPT);

  // Generate a unique verification code for email confirmation
  $verification_code = md5(uniqid($email, true));

  // Insert user data into the database (account inactive by default)
  $stmt = $conn->prepare("INSERT INTO users (name, email, password, verification_code, is_verified) VALUES (?, ?, ?, ?, 0)");
  $stmt->bind_param("ssss", $name, $email, $hashed, $verification_code);

  if ($stmt->execute()) {
    // Send the verification email
    sendVerificationEmail($email, $verification_code);
    echo "<h3>✅ Registration successful! Please check your email to verify your account.</h3>";
  } else {
    echo "<h3>❌ Error: Email may already exist or database error occurred.</h3>";
  }

  $stmt->close();
}
?>
