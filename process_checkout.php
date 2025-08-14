<?php
session_start();
header('Content-Type: application/json');

// In a real application, you would integrate with a payment gateway here
// This is just a simulation

sleep(2); // Simulate processing time

if (!empty($_SESSION['cart'])) {
    // Process payment (simulated)
    $success = rand(0, 1); // 50% chance of success for demo
    
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Payment declined']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Cart is empty']);
}
?>