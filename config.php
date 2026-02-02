<?php
$host = "localhost";
$user = "laura";
$pass = "";
$db   = "tienda_soma";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$conn->set_charset("utf8");
