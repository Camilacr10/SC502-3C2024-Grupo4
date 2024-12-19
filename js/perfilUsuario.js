document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/usuario.php';
    const API_URL_ADMIN = 'backend/adminUsuarios.php';
    let usuarioActivo = null;
    const deleteAccountButton = document.getElementById('eliminarCuenta');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const confirmDeleteButton = document.getElementById('confirmDelete');

    async function ObtenerUsuario() {
        try {
            const response = await fetch(API_URL);
            const usuario = await response.json();

            if (response.ok) {
                usuarioActivo = usuario;

                if (usuarioActivo === "Sesion no activa") {
                    return;
                } else {

                    document.getElementById('logout-btn').addEventListener('click', async function () {
                        try {
                            await fetch('backend/logout.php', { method: 'POST' });

                            window.location.href = "Index.html";

                        } catch (err) {
                            console.error("Error al cerrar sesión:", err);
                        }
                    });
                    renderPerfilUsuario(usuario);
                }
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }
    }
    function renderPerfilUsuario(usuario) {
        document.getElementById('username').value = usuario.username;
        document.getElementById('password').value = usuario.password;
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellido').value = usuario.apellido;
        document.getElementById('correo').value = usuario.correo;
        document.getElementById('telefono').value = usuario.telefono;
    }

    document.getElementById('usuarioForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const id_rol = usuarioActivo.id_rol
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const activo = usuarioActivo.activo;

        let response; // Variable para almacenar la respuesta temporal

        response = await fetch(`${API_URL_ADMIN}?id_usuario=${usuarioActivo.id_usuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_rol: id_rol,
                username: username,
                password: password,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                telefono: telefono,
                ruta_imagen: "n/a",
                activo: activo,
            }),
            credentials: 'include'
        });
        if (response.ok) {
            const mensaje = document.createElement("div");
            mensaje.className = "alert alert-success text-center mt-3";
            mensaje.textContent = "¡Los datos se han actualizado exitosamente!";

            const formContainer = document.querySelector(".form-container");
            formContainer.appendChild(mensaje);

            this.reset();

            setTimeout(() => {
                mensaje.remove();
            }, 5000);

            ObtenerUsuario();
        } else {
            const mensaje = document.createElement("div");
            mensaje.className = "alert alert-danger text-center mt-3";
            mensaje.textContent = "Ocurrió un error al actualizar los datos.";

            const formContainer = document.querySelector(".form-container");
            formContainer.appendChild(mensaje);

            setTimeout(() => {
                mensaje.remove();
            }, 5000);
        }
    });

    deleteAccountButton.addEventListener('click', function () {
        confirmationModal.show();
    });

    confirmDeleteButton.addEventListener('click', async function () {
        const response = await fetch(`${API_URL_ADMIN}?id_usuario=${usuarioActivo.id_usuario}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            await fetch('backend/logout.php', { method: 'POST' });

            window.location.href = "Index.html";
        } else {
            console.error("Error al eliminar el usuario");
        }
        confirmationModal.hide();
    });

    ObtenerUsuario();
});
