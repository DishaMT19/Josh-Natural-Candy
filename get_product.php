<?php
session_start();
require_once 'db.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product ID']);
    exit;
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("SELECT id, name, description, price, image FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
    exit;
}

$product = $result->fetch_assoc();
$product['image'] = 'images/' . basename($product['image']);

header('Content-Type: application/json');
echo json_encode($product);
?>
