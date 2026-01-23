<?php
include 'config.php';

//RECIBO LOS DATOS EN FORMATO JSON
$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    $id = $datos['id'];
    $nombre = $datos['nombre'];
    $email = $datos['email'];
    $tel = $datos['telefono'];
    $cuenta = $datos['cuenta'];

    $sql = "INSERT INTO usuarios (id_usuario, nombre, email, telefono, cuenta_bancaria) 
            VALUES ('$id', '$nombre', '$email', '$tel', '$cuenta')";

    if ($conn->query($sql)) {
        echo json_encode(["mensaje" => "exito"]);
    } else {
        echo json_encode(["mensaje" => "Error: " . $conn->error]);
    }
}
