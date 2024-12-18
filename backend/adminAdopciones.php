<?php

require 'db.php';

function agregarAdopcion($id_usuario, $id_mascota, $fecha_solicitud, $estado, $descripcion)
{
    global $pdo;

    try {
        $sql = "INSERT INTO  Adopcion (id_usuario, id_mascota, fecha_solicitud, estado, descripcion) 
                VALUES (:id_usuario, :id_mascota, :fecha_solicitud, :estado, :descripcion)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_usuario' => $id_usuario,
            'id_mascota' => $id_mascota,
            'fecha_solicitud' => $fecha_solicitud,
            'estado' => $estado,
            'descripcion' => $descripcion,
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        logError("Error agregando adopción: " . $e->getMessage());
        return 0;
    }
}

function obtenerAdopciones()
{
    global $pdo;

    try {
        $sql = "
            SELECT 
                a.id_adopcion,
                a.fecha_solicitud,
                a.estado,
                a.descripcion,
                u.nombre AS usuario_nombre,
                u.id_usuario AS id_usuario,
                m.nombre AS mascota_nombre,
                m.id_mascota AS id_mascota
            FROM 
                Adopcion a
            INNER JOIN 
                Usuario u ON a.id_usuario = u.id_usuario
            INNER JOIN 
                Mascota m ON a.id_mascota = m.id_mascota
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $adopciones = [];
        foreach ($rows as $row) {
            $id_adopcion = $row['id_adopcion'];

            if (!isset($adopciones[$id_adopcion])) {
                $adopciones[$id_adopcion] = [
                    "id_adopcion" => $row["id_adopcion"],
                    "id_usuario" => $row["id_usuario"],
                    "usuario_nombre" => $row["usuario_nombre"],
                    "id_mascota" => $row["id_mascota"],
                    "mascota_nombre" => $row["mascota_nombre"],
                    "fecha_solicitud" => $row["fecha_solicitud"],
                    "estado" => $row["estado"],
                    "descripcion" => $row["descripcion"],
                ];
            }
        }

        return array_values($adopciones);
    } catch (Exception $e) {
        logError("Error obteniendo las adopciones: " . $e->getMessage());
        return [];
    }
}

function editarAdopcion($id_adopcion, $id_usuario, $id_mascota, $fecha_solicitud, $estado, $descripcion)
{
    global $pdo;

    try {
        $sql = "UPDATE Adopcion 
                SET id_usuario = :id_usuario, id_mascota = :id_mascota, fecha_solicitud = :fecha_solicitud , estado = :estado , descripcion = :descripcion 
                WHERE id_adopcion = :id_adopcion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_usuario' => $id_usuario,
            'id_mascota' => $id_mascota,
            'fecha_solicitud' => $fecha_solicitud,
            'estado' => $estado,
            'descripcion' => $descripcion,
            'id_adopcion' => $id_adopcion
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        logError("Error aditando adopción: " . $e->getMessage());
        return 0;
    }
}


function eliminarAdopcion($id_adopcion)
{
    global $pdo;

    try {
        $sql = "DELETE FROM Adopcion WHERE id_adopcion = :id_adopcion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_adopcion' => $id_adopcion]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        logError("Error eliminando adopción: " . $e->getMessage());
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
        $adopciones = obtenerAdopciones();
        echo json_encode($adopciones);
        break;

    case 'POST':
        $input = getJsonInput();
        if (
            isset(
            $input['id_usuario'],
            $input['id_mascota'],
            $input['fecha_solicitud'],
            $input['estado'],
            $input['descripcion']
        )
        ) {
            $id_adopcion = agregarAdopcion(
                $input['id_usuario'],
                $input['id_mascota'],
                $input['fecha_solicitud'],
                $input['estado'],
                $input['descripcion']
            );

            if ($id_adopcion > 0) {
                http_response_code(201);
                echo json_encode(["message" => "Donación creada: ID: $id_donacion"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error creando la donación"]);
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
            $input['id_usuario'],
            $input['id_mascota'],
            $input['fecha_solicitud'],
            $input['estado'],
            $input['descripcion']
        )
        ) {
            $editResult = editarAdopcion(
                $_GET['id_adopcion'],
                $input['id_usuario'],
                $input['id_mascota'],
                $input['fecha_solicitud'],
                $input['estado'],
                $input['descripcion']
            );

            if ($editResult) {
                http_response_code(201);
                echo json_encode(['message' => "Donación actualizada"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error actualizando la donación"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id_adopcion'])) {
            $fueEliminado = eliminarAdopcion($_GET['id_adopcion']);

            if ($fueEliminado) {
                http_response_code(200);
                echo json_encode(['message' => "Donación eliminada"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error eliminando la donación"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Metodo no permitido"]);
        break;
}

