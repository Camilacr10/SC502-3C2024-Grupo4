<?php
require 'db.php';

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
            'fecha_donacion' => $fecha_donacion
        ]);

        return $pdo->lastInsertId(); // Devuelve el ID de la donación creada
    } catch (Exception $e) {
        logError("Error creando donación: " . $e->getMessage());
        return 0;
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
    
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
