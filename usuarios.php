<?php
//CONFIGURAR CABECERA PARA JSON
header('Content-Type: application/json');

include 'config.php';

//RECIBO LOS DATOS EN FORMATO JSON
$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    $accion = isset($datos['accion']) ? $datos['accion'] : 'registro';

    //LOGIN - VERIFICAR USUARIO SI EXISTE
    if ($accion === 'login') {
        $id = $datos['id'];
        $email = $datos['email'];

        $sql = "SELECT * FROM usuarios WHERE id_usuario = '$id' AND email = '$email'";
        $resultado = $conn->query($sql);

        if ($resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();
            echo json_encode([
                "mensaje" => "exito",
                "usuario" => [
                    "id" => $usuario['id_usuario'],
                    "nombre" => $usuario['nombre'],
                    "email" => $usuario['email'],
                    "telefono" => $usuario['telefono'],
                    "cuenta" => $usuario['cuenta_bancaria']
                ]
            ]);
        } else {
            echo json_encode(["mensaje" => "error", "detalle" => "Usuario no encontrado"]);
        }
    }
    //REGISTRO - CREAR NUEVO USUARIO
    else if ($accion === 'registro') {
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
} else {
    echo json_encode(["mensaje" => "Error: No se recibieron datos"]);
}
