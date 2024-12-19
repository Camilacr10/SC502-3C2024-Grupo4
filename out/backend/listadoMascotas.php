<?php

require 'db.php';

//obtener Mascotas
function obtenerMascotas()
{
    global $pdo;
    try {
        // Consulta para obtener todas las mascotas
        $sql = "SELECT * from mascota where disponibilidad = 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error al obtener las mascotas: " . $e->getMessage());
        return [];
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
        $mascotas = obtenerMascotas();
        echo json_encode($mascotas);
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Metodo no permitido"]);
        break;
}
