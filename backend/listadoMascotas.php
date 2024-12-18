<?php

require 'db.php';

//obtener Mascotas
function obtenerMascotas()
{
    global $pdo;
    try {
        // Consulta para obtener todas las mascotas
        $sql = "SELECT id_mascota, nombre, ruta_imagen from mascota where disponibilidad = 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $mascotas = [];
        foreach ($rows as $row) {
            $id_mascota = $row['id_mascota'];

            if (!isset($mascotas[$id_mascota])) {
                $mascotas[$id_mascota] = [
                    "id_mascota" => $row["id_mascota"],
                    "nombre" => $row["nombre"],
                    "ruta_imagen" => $row["ruta_imagen"],
                ];
            }
        }

        return array_values($mascotas);

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
