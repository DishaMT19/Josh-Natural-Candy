<?php
session_start();
header('Content-Type: application/json');

// Decode the incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

// ✅ Replace with your actual credentials
$correctUsername = 'admin@gmail.com';
$correctPassword = 'admin19';

// Check credentials
if ($username === $correctUsername && $password === $correctPassword) {
    $_SESSION['admin_logged_in'] = true;
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}
?>
