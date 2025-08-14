<?php
header('Content-Type: application/json');
require 'db.php';

// Decode request
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['order']) || !isset($data['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    exit;
}

$order = $data['order'];
$user = $data['user'];

$user_id = isset($user['id']) ? intval($user['id']) : null;
$user_name = isset($user['name']) ? $user['name'] : 'Guest';
$items = isset($order['items']) ? $order['items'] : [];
$total = isset($order['total']) ? floatval($order['total']) : 0.00;
$status = isset($order['status']) ? $order['status'] : 'pending';

if (empty($items)) {
    echo json_encode(['status' => 'error', 'message' => 'No items in order']);
    exit;
}

$items_json = json_encode($items);

// Insert into `orders`
$stmt = $conn->prepare("INSERT INTO orders (user_id, user_name, items, total, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issds", $user_id, $user_name, $items_json, $total, $status);

if ($stmt->execute()) {
    $order_id = $stmt->insert_id;

    // Insert each item into `order_items`
    $item_stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)");
    
    foreach ($items as $item) {
        $product_id = $item['id'] ?? 0;
        $name = $item['name'] ?? '';
        $qty = $item['quantity'] ?? 1;
        $price = $item['price'] ?? 0.00;
        $item_stmt->bind_param("iisid", $order_id, $product_id, $name, $qty, $price);
        $item_stmt->execute();
    }

    echo json_encode(['status' => 'success', 'order_id' => $order_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}
?>
