<?php
session_start();
require 'db.php';

header('Content-Type: text/csv');
header('Content-Type: text/csv; charset=UTF-8');


$output = fopen("php://output", "w");
fputcsv($output, ['Order ID', 'User ID', 'Items', 'Total', 'Date']);

$result = $conn->query("SELECT * FROM orders");

while ($row = $result->fetch_assoc()) {
    fputcsv($output, [$row['id'], $row['user_id'], $row['items'], $row['total'], $row['created_at']]);
}

fclose($output);
exit;
echo "\xEF\xBB\xBF"; // UTF-8 BOM
?>