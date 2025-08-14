<?php
session_start();
$cart = $_SESSION['cart'] ?? [];
?>
<h2>Your Cart</h2>
<?php if (empty($cart)): ?>
  <p>Cart is empty.</p>
<?php else: ?>
  <ul>
  <?php foreach ($cart as $item): ?>
    <li><?= $item['name'] ?> - ₹<?= $item['price'] ?> - Qty: <?= $item['quantity'] ?></li>
  <?php endforeach; ?>
  </ul>
<?php endif; ?>
