<?php
session_start();
header('Content-Type: application/json');

$cartItems = [];
if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
    // Connect to database (replace with your actual DB connection)
    $db = new PDO('mysql:host=localhost;dbname=your_db', 'username', 'password');
    
    foreach ($_SESSION['cart'] as $productId => $quantity) {
        $stmt = $db->prepare("SELECT id, name, price, image FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($product) {
            $cartItems[] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'price' => (float)$product['price'],
                'quantity' => $quantity,
                'image' => $product['image']
            ];
        }
    }
}

echo json_encode($cartItems);
?>