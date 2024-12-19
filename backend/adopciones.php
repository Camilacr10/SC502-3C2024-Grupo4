<?php

require 'db.php'; 

function buscarMascotaPorId($id_mascota){
    global $pdo;
    try {
        $sql = "SELECT nombre FROM mascota WHERE id_mascota = :id_mascota";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_mascota' => $id_mascota]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error buscando mascota: " . $e->getMessage());
        return null;
    }
}

// Función para crear una adopción
function crearAdopcion($id_usuario, $id_mascota, $descripcion)
{
    global $pdo;

    try {
        $sql = "INSERT INTO Adopcion (id_usuario, id_mascota, fecha_solicitud, estado, descripcion) 
                VALUES (:id_usuario, :id_mascota, CURRENT_DATE, 'Revisión pendiente', :descripcion)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_usuario' => $id_usuario,
            'id_mascota' => $id_mascota,
            'descripcion' => $descripcion
        ]);
        return $pdo->lastInsertId(); // Devuelve el ID de la adopción creada
    } catch (Exception $e) {
        logError("Error creando adopción: " . $e->getMessage());
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

session_start();
switch ($method) {
    case 'GET':
        $mascota = buscarMascotaPorId($_GET['id_mascota']);
            echo json_encode($mascota);
            break;

            case 'POST':
                $input = getJsonInput(); // Obtener los datos enviados desde el frontend
        
                // Verificar que los campos necesarios están presentes
                if (
                    isset(
                        $input['id_usuario'],
                        $input['id_mascota'],
                        $input['descripcion']
                    )
                ) {
        
                    // Llamar a la función para crear la adopción
                    $id_adopcion = crearAdopcion(
                        $input['id_usuario'],
                        $input['id_mascota'],
                        $input['descripcion']
                    );
        
                    if ($id_adopcion > 0) {
                        http_response_code(201); // Respuesta exitosa
                        echo json_encode(["message" => "Adopción creada: ID: $id_adopcion"]);
                    } else {
                        http_response_code(500); // Error en el servidor
                        echo json_encode(["error" => "Error creando la adopción"]);
                    }
                } else {
                    http_response_code(400); // Datos insuficientes
                    echo json_encode(["error" => "Datos insuficientes"]);
                }
                break;
    
    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}

