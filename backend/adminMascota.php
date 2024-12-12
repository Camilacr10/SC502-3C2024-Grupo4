<?php

require 'db.php'; // Archivo que conecta con la base de datos

// Función para crear una mascota
function crearMascota($nombre, $edad, $especie, $raza, $peso, $sexo, $castrado, $vacunado, $desparasitado, $descripcion, $fecha_rescate, $ruta_imagen, $disponibilidad)
{
    global $pdo;

    try {
        $sql = "INSERT INTO mascota (nombre, edad, especie, raza, peso, sexo, castrado, vacunado, desparasitado, descripcion, fecha_rescate, ruta_imagen, disponibilidad) 
                VALUES (:nombre, :edad, :especie, :raza, :peso, :sexo, :castrado, :vacunado, :desparasitado, :descripcion, :fecha_rescate, :ruta_imagen, :disponibilidad)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nombre' => $nombre,
            'edad' => $edad,
            'especie' => $especie,
            'raza' => $raza,
            'peso' => $peso,
            'sexo' => $sexo,
            'castrado' => $castrado,
            'vacunado' => $vacunado,
            'desparasitado' => $desparasitado,
            'descripcion' => $descripcion,
            'fecha_rescate' => $fecha_rescate,
            'ruta_imagen' => $ruta_imagen,
            'disponibilidad' => $disponibilidad,
        ]);
        return $pdo->lastInsertId(); // Devuelve el ID de la mascota creada
    } catch (Exception $e) {
        logError("Error creando mascota: " . $e->getMessage());
        return 0;
    }
}

// Función para editar una mascota
function editarMascota($id_mascota, $nombre, $edad, $especie, $raza, $peso, $sexo, $castrado, $vacunado, $desparasitado, $descripcion, $fecha_rescate, $ruta_imagen, $disponibilidad)
{
    global $pdo;

    try {
        $sql = "UPDATE mascota 
                SET nombre = :nombre, edad = :edad, especie = :especie, raza = :raza, peso = :peso, 
                    sexo = :sexo, castrado = :castrado, vacunado = :vacunado, desparasitado = :desparasitado, 
                    descripcion = :descripcion, fecha_rescate = :fecha_rescate, ruta_imagen = :ruta_imagen, 
                    disponibilidad = :disponibilidad 
                WHERE id_mascota = :id_mascota";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'nombre' => $nombre,
            'edad' => $edad,
            'especie' => $especie,
            'raza' => $raza,
            'peso' => $peso,
            'sexo' => $sexo,
            'castrado' => $castrado,
            'vacunado' => $vacunado,
            'desparasitado' => $desparasitado,
            'descripcion' => $descripcion,
            'fecha_rescate' => $fecha_rescate,
            'ruta_imagen' => $ruta_imagen,
            'disponibilidad' => $disponibilidad,
            'id_mascota' => $id_mascota,
        ]);
        $affectRows = $stmt->rowCount();
        return $affectRows > 0; // Devuelve true si se actualizó algo
    } catch (Exception $e) {
        logError("Error editando mascota: " . $e->getMessage());
        return false;
    }
}

// Función para obtener todas las mascotas
function obtenerTodasLasMascotas()
{
    global $pdo;

    try {
        $sql = "SELECT * FROM mascota";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // Devuelve todas las mascotas como array asociativo
    } catch (Exception $e) {
        logError("Error obteniendo todas las mascotas: " . $e->getMessage());
        return [];
    }
}

// Función para eliminar una mascota
function eliminarMascota($id_mascota)
{
    global $pdo;

    try {
        $sql = "DELETE FROM mascota WHERE id_mascota = :id_mascota";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_mascota' => $id_mascota]);
        return $stmt->rowCount() > 0; // Devuelve true si se eliminó algo
    } catch (Exception $e) {
        logError("Error eliminando mascota: " . $e->getMessage());
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

//Acá tenemos que ver si hacer lo de la sesión como en la clase de app tareas
switch ($method) {
    case 'GET':
        $mascotas = obtenerTodasLasMascotas();
        echo json_encode($mascotas);
        break;

    case 'POST':
        $input = getJsonInput();

        if (
            isset(
            $input['nombre'],
            $input['edad'],
            $input['especie'],
            $input['raza'],
            $input['peso'],
            $input['sexo'],
            $input['castrado'],
            $input['vacunado'],
            $input['desparasitado'],
            $input['descripcion'],
            $input['fecha_rescate'],
            $input['ruta_imagen'],
            $input['disponibilidad']
        )
        ) {

            $id_mascota = crearMascota(
                $input['nombre'],
                $input['edad'],
                $input['especie'],
                $input['raza'],
                $input['peso'],
                $input['sexo'],
                $input['castrado'],
                $input['vacunado'],
                $input['desparasitado'],
                $input['descripcion'],
                $input['fecha_rescate'],
                $input['ruta_imagen'],
                $input['disponibilidad']
            );

            if ($id_mascota > 0) {
                http_response_code(201);
                echo json_encode(["message" => "Mascota creada: ID:" . $id_mascota]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error general creando la mascota"]);
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
            $input['nombre'],
            $input['edad'],
            $input['especie'],
            $input['raza'],
            $input['peso'],
            $input['sexo'],
            $input['castrado'],
            $input['vacunado'],
            $input['desparasitado'],
            $input['descripcion'],
            $input['fecha_rescate'],
            $input['ruta_imagen'],
            $input['disponibilidad']
        )
        ) {
            $editResult = editarMascota(
                $_GET['id_mascota'],
                $input['nombre'],
                $input['edad'],
                $input['especie'],
                $input['raza'],
                $input['peso'],
                $input['sexo'],
                $input['castrado'],
                $input['vacunado'],
                $input['desparasitado'],
                $input['descripcion'],
                $input['fecha_rescate'],
                $input['ruta_imagen'],
                $input['disponibilidad']
            );

            if ($editResult) {
                http_response_code(201);
                echo json_encode(['message' => "Mascota actualizada"]);
            } else {
                http_response_code(500);
                echo json_encode(['message' => "Error actualizando la mascota"]);
            }

        } else {
            //retornar un error
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    case 'DELETE':


        if ($_GET['id_mascota']) {
            $fueEliminado = eliminarMascota($_GET['id_mascota']);
            if ($fueEliminado) {
                http_response_code(200);
                echo json_encode(['message' => "Mascota eliminada"]);
            } else {
                http_response_code(500);
                echo json_encode(['message' => "Error eliminando la mascota"]);
            }

        } else {
            //retornar un error
            http_response_code(400);
            echo json_encode(["error" => "Datos insuficientes"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}