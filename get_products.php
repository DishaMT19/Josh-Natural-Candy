<?php
session_start();
// Include database connection
require_once 'db.php';

// Prepare SQL to fetch all products
$sql = "SELECT id, name, description, price, image FROM products ORDER BY id DESC";
$result = $conn->query($sql);

// Initialize products array
$products = [];

// Fetch and format each product row
while ($row = $result->fetch_assoc()) {
    // Make sure only the filename is returned (no "images/" prefix in DB)
    $row['image'] = 'images/' . basename($row['image']);
    $products[] = $row;
}

// Output as JSON
header('Content-Type: application/json');
echo json_encode($products);
?>
