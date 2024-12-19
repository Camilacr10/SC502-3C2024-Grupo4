document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/registro.php';
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;

        const newUsuario = {
            id_rol: "2",
            username: username,
            password: password,
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono: telefono,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUsuario),
            });
        
            const textResponse = await response.text();
            console.log("Respuesta del servidor:", textResponse);
        
            if (!response.ok) {
                console.error("Error HTTP:", response.status);
            } else {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Error en el fetch:", error);
        }
    });
});
