<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// Validation
if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

if ($data['password'] !== $data['confirm']) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
    exit;
}

// In a real app, you would save to database here
echo json_encode([
    'status' => 'success',
    'message' => 'Registration successful'
]);
?>