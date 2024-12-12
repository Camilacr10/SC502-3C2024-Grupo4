<?php

require 'db.php'; // Archivo que conecta con la base de datos

// Función para crear una donación
function crearDonacion($monto, $nombre_donante, $email_donante, $metodo_pago, $numero_tarjeta, $fecha_expiracion, $codigo_seguridad, $fecha_donacion)
{
    global $pdo;

    try {
        $sql = "INSERT INTO Donacion (monto, nombre_donante, email_donante, metodo_pago, numero_tarjeta, fecha_expiracion, codigo_seguridad, fecha_donacion) 
                VALUES (:monto, :nombre_donante, :email_donante, :metodo_pago, :numero_tarjeta, :fecha_expiracion, :codigo_seguridad, :fecha_donacion)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'monto' => $monto,
            'nombre_donante' => $nombre_donante,
            'email_donante' => $email_donante,
            'metodo_pago' => $metodo_pago,
            'numero_tarjeta' => $numero_tarjeta,
            'fecha_expiracion' => $fecha_expiracion,
            'codigo_seguridad' => $codigo_seguridad,
            'fecha_donacion' => $fecha_donacion,
        ]);
        return $pdo->lastInsertId(); // Devuelve el ID de la donacion creada
    } catch (Exception $e) {
        logError("Error creando donación: " . $e->getMessage());
        return 0;
    }
}

// Función para editar una donación
function editarDonacion($id_donacion, $monto, $nombre_donante, $email_donante, $metodo_pago, $numero_tarjeta, $fecha_expiracion, $codigo_seguridad, $fecha_donacion)
{
    global $pdo;

    try {
        $sql = "UPDATE Donacion 
                SET monto = :monto, nombre_donante = :nombre_donante, email_donante = :email_donante, metodo_pago = :metodo_pago, 
                    numero_tarjeta = :numero_tarjeta, fecha_expiracion = :fecha_expiracion, codigo_seguridad = :codigo_seguridad, 
                    fecha_donacion = :fecha_donacion
                WHERE id_donacion = :id_donacion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_donacion' => $id_donacion,
            'monto' => $monto,
            'nombre_donante' => $nombre_donante,
            'email_donante' => $email_donante,
            'metodo_pago' => $metodo_pago,
            'numero_tarjeta' => $numero_tarjeta,
            'fecha_expiracion' => $fecha_expiracion,
            'codigo_seguridad' => $codigo_seguridad,
            'fecha_donacion' => $fecha_donacion,
        ]);
        return $stmt->rowCount() > 0; // Devuelve true si se actualizó algo
    } catch (Exception $e) {
        logError("Error editando donación: " . $e->getMessage());
        return false;
    }
}

// Función para obtener todas las donaciones
function obtenerTodasLasDonaciones()
{
    global $pdo;

    try {
        $sql = "SELECT * FROM Donacion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Devuelve todas las donaciones como array asociativo
    } catch (Exception $e) {
        logError("Error obteniendo todas las donaciones: " . $e->getMessage());
        return [];
    }
}

// Función para eliminar una donación
function eliminarDonacion($id_donacion)
{
    global $pdo;

    try {
        $sql = "DELETE FROM Donacion WHERE id_donacion = :id_donacion";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_donacion' => $id_donacion]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        logError("Error eliminando donación: " . $e->getMessage());
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
        $donaciones = obtenerTodasLasDonaciones();
        echo json_encode($donaciones);
        break;

    case 'POST':
        $input = getJsonInput();

        if (
            isset(
            $input['monto'],
            $input['nombre_donante'],
            $input['email_donante'],
            $input['metodo_pago'],
            $input['numero_tarjeta'],
            $input['fecha_expiracion'],
            $input['codigo_seguridad'],
            $input['fecha_donacion']
        )
        ) {
            $id_donacion = crearDonacion(
                $input['monto'],
                $input['nombre_donante'],
                $input['email_donante'],
                $input['metodo_pago'],
                $input['numero_tarjeta'],
                $input['fecha_expiracion'],
                $input['codigo_seguridad'],
                $input['fecha_donacion']
            );

            if ($id_donacion > 0) {
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
            $input['monto'],
            $input['nombre_donante'],
            $input['email_donante'],
            $input['metodo_pago'],
            $input['numero_tarjeta'],
            $input['fecha_expiracion'],
            $input['codigo_seguridad'],
            $input['fecha_donacion']
        )
        ) {
            $editResult = editarDonacion(
                $_GET['id_donacion'],
                $input['monto'],
                $input['nombre_donante'],
                $input['email_donante'],
                $input['metodo_pago'],
                $input['numero_tarjeta'],
                $input['fecha_expiracion'],
                $input['codigo_seguridad'],
                $input['fecha_donacion']
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
        if (isset($_GET['id_donacion'])) {
            $fueEliminado = eliminarDonacion($_GET['id_donacion']);

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
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
