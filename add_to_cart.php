<?php
session_start();

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'], $data['name'], $data['price'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Check if already in cart
$found = false;
foreach ($_SESSION['cart'] as &$item) {
    if ($item['id'] == $data['id']) {
        $item['quantity'] += 10;
        $found = true;
        break;
    }
}

if (!$found) {
    $_SESSION['cart'][] = [
        'id' => $data['id'],
        'name' => $data['name'],
        'price' => $data['price'],
        'image' => $data['image'],
        'quantity' => 10
    ];
}

echo json_encode(['success' => true]);
?>
