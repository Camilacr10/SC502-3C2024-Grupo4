<?php

require 'db.php';

// Obtener Mascota con requisitos
function obtenerMascotaConRequisitos($id_mascota)
{
    global $pdo;
    try {
        // Consulta para obtener la mascota y sus requisitos
        $sql = "
            SELECT 
                m.id_mascota,
                m.nombre,
                m.edad,
                m.especie,
                m.raza,
                m.peso,
                m.sexo,
                m.castrado,
                m.vacunado,
                m.desparasitado,
                m.descripcion,
                m.fecha_rescate,
                m.ruta_imagen,
                m.disponibilidad,
                r.id_requisito,
                r.descripcion AS requisito
            FROM 
                Mascota m
            LEFT JOIN 
                Mascota_Requisito mr ON m.id_mascota = mr.id_mascota
            LEFT JOIN 
                Requisito r ON mr.id_requisito = r.id_requisito
            WHERE 
                m.id_mascota = :id_mascota
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_mascota', $id_mascota, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (!$rows) {
            echo "No se encontraron resultados para la consulta.";
            exit;
        }

        // Procesar resultados para agrupar requisitos bajo la mascota
        $mascota = [];
        foreach ($rows as $row) {
            $id_mascota = $row['id_mascota'];

            if (!isset($mascota[$id_mascota])) {
                $mascota[$id_mascota] = [
                    "id_mascota" => $row["id_mascota"],
                    "nombre" => $row["nombre"],
                    "edad" => $row["edad"],
                    "especie" => $row["especie"],
                    "raza" => $row["raza"],
                    "peso" => $row["peso"],
                    "sexo" => $row["sexo"],
                    "castrado" => $row["castrado"],
                    "vacunado" => $row["vacunado"],
                    "desparasitado" => $row["desparasitado"],
                    "descripcion" => $row["descripcion"],
                    "fecha_rescate" => $row["fecha_rescate"],
                    "ruta_imagen" => $row["ruta_imagen"],
                    "disponibilidad" => $row["disponibilidad"],
                    "requisitos" => []
                ];
            }

            if (!empty($row['id_requisito'])) {
                $mascota[$id_mascota]['requisitos'][] = [
                    "id_requisito" => $row["id_requisito"],
                    "descripcion" => $row["requisito"]
                ];
            }
        }

        return !empty($mascota) ? reset($mascota) : null;

    } catch (Exception $e) {
        logError("Error al obtener la mascota con sus requisitos: " . $e->getMessage());
        return null;
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
        $mascota = obtenerMascotaConRequisitos($_GET['id_mascota']);
        echo json_encode($mascota);
        break;
    default:
        http_response_code(405);
        echo json_encode(["error" => "Metodo no permitido"]);
        break;
}
