<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$cart = $data['cart'];
$total = $data['total'];

// Insert into orders table
$stmt = $conn->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
$stmt->bind_param("id", $user_id, $total);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

// Insert each item into order_items table
$stmt = $conn->prepare("INSERT INTO order_items (order_id, product_name, quantity, price) VALUES (?, ?, ?, ?)");
foreach ($cart as $item) {
    $stmt->bind_param("isid", $order_id, $item['name'], $item['quantity'], $item['price']);
    $stmt->execute();
}
$stmt->close();

echo json_encode(["status" => "success", "order_id" => $order_id]);
?>
