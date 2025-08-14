<?php
require_once 'db.php';
header('Content-Type: application/json');

$orders = [];
$order_result = $conn->query("SELECT * FROM orders ORDER BY id DESC");

while ($order = $order_result->fetch_assoc()) {
    // ✅ Decode JSON string from items column
    $order['items'] = json_decode($order['items'], true);
    $orders[] = $order;
}

echo json_encode($orders);
?>
