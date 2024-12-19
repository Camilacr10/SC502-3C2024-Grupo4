<?php
session_start();
require 'db.php';

function login($username, $password){
    try{
        global $pdo;
        $sql = "SELECT * FROM Usuario WHERE username = :username";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user && password_verify($password, $user['password'])){
            $_SESSION['user_id'] = $user['id_usuario'];
            $_SESSION['user_role'] = $user['id_rol']; // Guardar el rol en la sesión
            return $user['id_rol']; // Devuelve el rol del usuario
        }
        return false;
    } catch(Exception $e){
        logError($e->getMessage());
        return false;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if($method == 'POST'){
    if(isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
        $role = login($username, $password);

        if($role){
            http_response_code(200);
            echo json_encode(["message" => "Login exitoso", "role" => $role]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Usuario o password incorrecto"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Email y password son requeridos"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error"=> "Método no permitido"]);
}
