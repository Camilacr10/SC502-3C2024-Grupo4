<?php
require 'db.php';

function getUsuarioActivo($id_usuario) {
    global $pdo;
    try {
        $sql = "SELECT * FROM Usuario WHERE id_usuario = :id_usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id_usuario' => $id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        logError("Error obteniendo usuario activo: " . $e->getMessage());
        return null;
    }
}

session_start();
if (isset($_SESSION['user_id'])) {
    $usuario = getUsuarioActivo($_SESSION['user_id']);
    if ($usuario) {
        http_response_code(200);
        echo json_encode($usuario);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error obteniendo información del usuario"]);
    }
} else {
    echo json_encode("Sesion no activa");
}
