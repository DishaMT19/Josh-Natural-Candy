<?php
session_start();
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'];
$desc = $data['description'];
$price = $data['price'];
$image = $data['image'];

$stmt = $conn->prepare("INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssds", $name, $desc, $price, $image);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Insert failed"]);
}
?>
