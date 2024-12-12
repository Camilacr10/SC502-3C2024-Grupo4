<?php

require 'db.php'; // Archivo que conecta con la base de datos

// Función para crear un usuario
function crearUsuario($id_rol, $username, $password, $nombre, $apellido, $correo, $telefono, $ruta_imagen, $activo)
{
    global $pdo;

    try {
        $sql = "INSERT INTO Usuario (id_rol, username, password, nombre, apellido, correo, telefono, ruta_imagen, activo) 
                VALUES (:id_rol, :username, :password, :nombre, :apellido, :correo, :telefono, :ruta_imagen, :activo)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_rol' => $id_rol,
            'username' => $username,
            'password' => $password,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'correo' => $correo,
            'telefono' => $telefono,
            'ruta_imagen' => $ruta_imagen,
            'activo' => $activo,
        ]);
        return $pdo->lastInsertId(); // Devuelve el ID del usuario creado
    } catch (Exception $e) {
        logError("Error creando usuario: " . $e->getMessage());
        return 0;
    }
}

// Función para editar un usuario
function editarUsuario($id_usuario, $id_rol, $username, $password, $nombre, $apellido, $correo, $telefono, $ruta_imagen, $activo)
{
    global $pdo;

    try {
        $sql = "UPDATE Usuario 
                SET id_rol = :id_rol, username = :username, password = :password, nombre = :nombre, 
                    apellido = :apellido, correo = :correo, telefono = :telefono, ruta_imagen = :ruta_imagen, 
                    activo = :activo 
                WHERE id_usuario = :id_usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_rol' => $id_rol,
            'username' => $username,
            'password' => $password,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'correo' => $correo,
            'telefono' => $telefono,
            'ruta_imagen' => $ruta_imagen,
            'activo' => $activo,
            'id_usuario' => $id_usuario,
        ]);
        $affectRows = $stmt->rowCount();
        return $affectRows > 0; // Devuelve true si se actualizó algo
    } catch (Exception $e) {
        logError("Error editando usuario: " . $e->getMessage());
        return false;
    }
}

// Función para obtener todos los usuarios
function obtenerTodosLosUsuarios()
{
    global $pdo;

    try {
        $sql = "SELECT * FROM Usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Devuelve todos los usuarios como array asociativo
    } catch (Exception $e) {
        logError("Error obteniendo todos los usuarios: " . $e->getMessage());
        return [];
    }
}

// Función para eliminar un usuario
function eliminarUsuario($id_usuario)
{
    global $pdo;

    try {
        $sql = "DELETE FROM Usuario WHERE id_usuario = :id_usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_usuario' => $id_usuario]);
        return $stmt->rowCount() > 0; // Devuelve true si se eliminó algo
    } catch (Exception $e) {
        logError("Error eliminando usuario: " . $e->getMessage());
        return false;
    }
}

// Manejo de la solicitud HTTP
$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), true);
}

switch ($method) {
    case 'GET':
        $usuarios = obtenerTodosLosUsuarios();
        echo json_encode($usuarios);
        break;

    case 'POST':
        $input = getJsonInput();

        if (
            isset(
            $input['id_rol'],
            $input['username'],
            $input['password'],
            $input['nombre'],
            $input['apellido'],
            $input['correo'],
            $input['telefono'],
            $input['ruta_imagen'],
            $input['activo']
        )
        ) {
            $id_usuario = crearUsuario(
                $input['id_rol'],
                $input['username'],
                $input['password'],
                $input['nombre'],
                $input['apellido'],
                $input['correo'],
                $input['telefono'],
                $input['ruta_imagen'],
                $input['activo']
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
        break;

    case 'PUT':
        $input = getJsonInput();
        if (
            isset(
            $input['id_rol'],
            $input['username'],
            $input['password'],
            $input['nombre'],
            $input['apellido'],
            $input['correo'],
            $input['telefono'],
            $input['ruta_imagen'],
            $input['activo']
        )
        ) {
            $editResult = editarUsuario(
                $_GET['id_usuario'],
                $input['id_rol'],
                $input['username'],
                $input['password'],
                $input['nombre'],
                $input['apellido'],
                $input['correo'],
                $input['telefono'],
                $input['ruta_imagen'],
                $input['activo']
            );

            if ($editResult) {
                http_response_code(201);
                echo json_encode(['message' => "Usuario actualizado"]);
            } else {
                http_response_code(500);
                echo json_encode(['message' => "Error actualizando el usuario"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    case 'DELETE':
        if ($_GET['id_usuario']) {
            $fueEliminado = eliminarUsuario($_GET['id_usuario']);
            if ($fueEliminado) {
                http_response_code(200);
                echo json_encode(['message' => "Usuario eliminado"]);
            } else {
                http_response_code(500);
                echo json_encode(['message' => "Error eliminando el usuario"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
