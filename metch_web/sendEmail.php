<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

function sendVerificationEmail($toEmail, $verification_code) {
  $cfg = require __DIR__ . '/config.php';
  $mail = new PHPMailer(true);

  try {
    // Mailtrap SMTP configuration
    $mail->isSMTP();
    $mail->Host       = $cfg['smtp_host'];
    $mail->Port       = $cfg['smtp_port'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $cfg['smtp_user'];
    $mail->Password   = $cfg['smtp_pass'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    // Sender & receiver
    $mail->setFrom($cfg['from_email'], $cfg['from_name']);
    $mail->addAddress($toEmail);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'Verify your Metcha account';
    $verifyLink = 'http://localhost/metch_web/verify.php?code=' . urlencode($verification_code);
    $mail->Body = "
      <h2>Welcome to Metcha Café 💜</h2>
      <p>Please click the link below to verify your email:</p>
      <a href='$verifyLink'>$verifyLink</a>
      <br><br>
      <p>If you didn’t request this registration, you can ignore this email.</p>
    ";
    $mail->AltBody = "Verify your account here: $verifyLink";

    // Send
    $mail->send();
    echo '✅ Email sent successfully!';
  } catch (Exception $e) {
    echo "❌ Email could not be sent. Error: {$mail->ErrorInfo}";
  }
}
