<?php
require_once 'db.php'; // Make sure this connects to your DB

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Basic validation
if (empty($email) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
    exit;
}

// Fetch user by email
$stmt = $conn->prepare("SELECT name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email not found']);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (password_verify($password, $user['password'])) {
    echo json_encode([
        'status' => 'success',
        'user' => [
            'name' => $user['name'],
            'email' => $email
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
}
?>
