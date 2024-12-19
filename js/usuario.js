document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/usuario.php';
    let usuarioActivo = null;
    const authContainer = document.getElementById('auth-container');

    async function crearNavbar() {
        try {
            const response = await fetch(API_URL);
            const usuario = await response.json();

            if (response.ok) {
                usuarioActivo = usuario;

                if (usuarioActivo === "Sesion no activa") {
                    authContainer.innerHTML = `
                        <a href="login.html">
                            <button class="btn btn-warning rounded-pill" style="margin-left: 30px;">Iniciar Sesión</button>
                        </a>
                    `;
                } else {
                    authContainer.innerHTML = `
                        <a href="perfilUsuario.html" class="nav-link text-light" style="margin-left: 20px;">
                            <img src="img/usuario/mascota2.png" alt="user" style="width: 50px; height: 50px; border-radius: 50%;">
                        </a>
                    `;
                }
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }
    }

    crearNavbar();
});
