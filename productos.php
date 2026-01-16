<?php

header('Content-Type: application/json; charset=utf-8');

//
$host = '127.0.0.1';
$user = 'root';
$pass = ''; // 
$db   = 'tienda';

// Conexión
$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}
$mysqli->set_charset('utf8mb4');

//Consulta
$sql = "SELECT id_producto AS id, nombre, descripcion, precio, disponibilidad, imagen FROM productos";
if ($result = $mysqli->query($sql)) {
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
    $result->free();
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta']);
}

$mysqli->close();
?>