<?php
$conn = new mysqli("localhost", "root", "", "josh");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
