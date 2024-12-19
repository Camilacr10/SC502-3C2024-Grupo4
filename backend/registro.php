<?php
require 'db.php';
 
function crearUsuario($id_rol, $username, $password, $nombre, $apellido, $correo, $telefono)
{
    global $pdo;
    $passwordHashed = password_hash($password, PASSWORD_BCRYPT);

    try {
        $sql = "INSERT INTO Usuario (id_rol, username, password, nombre, apellido, correo, telefono) 
                VALUES (:id_rol, :username, :password, :nombre, :apellido, :correo, :telefono)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_rol' => $id_rol,
            'username' => $username,
            'password' => $passwordHashed,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'correo' => $correo,
            'telefono' => $telefono
        ]);
        return $pdo->lastInsertId(); // Devuelve el ID del usuario creado
    } catch (Exception $e) {
        logError("Error creando usuario: " . $e->getMessage());
        return 0;
    }
}


$method = $_SERVER['REQUEST_METHOD'];

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

if($method == 'POST'){

    $input = getJsonInput();

        if (
            isset(
            $input['id_rol'],
            $input['username'],
            $input['password'],
            $input['nombre'],
            $input['apellido'],
            $input['correo'],
            $input['telefono']
        )
        ) {
            $id_usuario = crearUsuario(
                $input['id_rol'],
                $input['username'],
                $input['password'],
                $input['nombre'],
                $input['apellido'],
                $input['correo'],
                $input['telefono']
            );

            if ($id_usuario > 0) {
                http_response_code(201);
                echo json_encode(["message" => "Usuario creado: ID:" . $id_usuario]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error general creando el usuario"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
    }