<?php
session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data['product_id'] ?? null;

if ($productId && isset($_SESSION['cart'][$productId])) {
    unset($_SESSION['cart'][$productId]);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Item not in cart']);
}
?>