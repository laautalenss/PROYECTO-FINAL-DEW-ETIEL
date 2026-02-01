<?php
include 'config.php';

$sql = "SELECT * FROM productos";
$resultado = $conn->query($sql);

$lista = [];
while ($fila = $resultado->fetch_assoc()) {
    $lista[] = [
        "id" => $fila['id_producto'],
        "nombre" => $fila['nombre'],
        "precio" => (float)$fila['precio'],
        "imagen" => $fila['imagen'],
        "descripcion" => $fila['descripcion'],
        "disponibilidad" => (int)$fila['disponibilidad']
    ];
}

//LO ENVÍO EN FORMATO JSON PARA QUE VUE LO PUEDA INTERPRETAR
echo json_encode($lista);
