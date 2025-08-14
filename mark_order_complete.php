<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id']);

$stmt = $conn->prepare("UPDATE orders SET status = 'completed' WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>