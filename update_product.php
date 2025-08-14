<?php
$conn = new mysqli("localhost", "root", "", "josh");
if ($conn->connect_error) die("Connection failed");

$data = json_decode(file_get_contents("php://input"), true);
$stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, image=? WHERE id=?");
$stmt->bind_param("ssdsi", $data['name'], $data['description'], $data['price'], $data['image'], $data['id']);
if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
