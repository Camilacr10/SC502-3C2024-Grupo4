document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    let usuarios = [];
    const API_URL = 'backend/adminUsuarios.php';

    // Función para cargar los usuarios
    async function loadUsuarios() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                usuarios = await response.json();
                renderUsuarios(usuarios);
            } else {
                console.error("Error al cargar los usuarios");
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Función para renderizar los usuarios en la interfaz
    function renderUsuarios(usuarios) {
        const usuarioList = document.getElementById('usuarioList');
        usuarioList.innerHTML = '';

        // Actualiza el contador
        document.getElementById('totalUsuarios').innerHTML = `<i class="fas fa-user"></i> ${usuarios.length}`;

        usuarios.forEach(function (usuario) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id_rol}</td>
                <td>${usuario.username}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.telefono}</td>
                <td>${usuario.activo ? "Si" : "No"}</td>
                <td>
                    <button class="btn btn-success btn-sm edit-usuario" data-id="${usuario.id_usuario}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-usuario" data-id="${usuario.id_usuario}">Eliminar</button>
                </td>
            `;
            usuarioList.appendChild(row);
        });

        document.querySelectorAll('.edit-usuario').forEach(button =>
            button.addEventListener('click', handleEditUsuario)
        );
        document.querySelectorAll('.delete-usuario').forEach(button =>
            button.addEventListener('click', handleDeleteUsuario)
        );
    }

    // Función para manejar la edición de un usuario
    function handleEditUsuario(event) {
        try {
            const usuarioId = parseInt(event.target.dataset.id);
            const usuario = usuarios.find(u => u.id_usuario === usuarioId);

            document.getElementById('id_rol').value = usuario.id_rol;
            document.getElementById('username').value = usuario.username;
            document.getElementById('password').value = usuario.password;
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('correo').value = usuario.correo;
            document.getElementById('telefono').value = usuario.telefono;
            document.getElementById('ruta_imagen').value = usuario.ruta_imagen;
            document.getElementById('activo').value = usuario.activo ? "1" : "0";

            isEditMode = true;
            edittingId = usuarioId;

            const modal = new bootstrap.Modal(document.getElementById('agregarUsuario'));
            modal.show();

        } catch (error) {
            alert("Error al intentar editar el usuario");
            console.error(error);
        }
    }

    // Función para manejar la eliminación de un usuario
    async function handleDeleteUsuario(event) {
        const usuarioId = parseInt(event.target.dataset.id);

        const response = await fetch(`${API_URL}?id_usuario=${usuarioId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadUsuarios();
        } else {
            console.error("Error al eliminar el usuario");
        }
    }

    // Manejar el envío del formulario
    document.getElementById('agregarUsuario').addEventListener('submit', async function (e) {
        e.preventDefault();

        const id_rol = parseInt(document.getElementById("id_rol").value);
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const ruta_imagen = document.getElementById("ruta_imagen").value;
        const activo = parseInt(document.getElementById("activo").value);

        let response; // Variable para almacenar la respuesta temporal

        if (isEditMode) {
            response = await fetch(`${API_URL}?id_usuario=${edittingId}`, {
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
                    ruta_imagen: ruta_imagen,
                    activo: activo,
                }),
                credentials: 'include'
            });
        } else {
            const newUsuario = {
                id_rol: id_rol,
                username: username,
                password: password,
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                telefono: telefono,
                ruta_imagen: ruta_imagen,
                activo: activo
            };

            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUsuario),
                credentials: "include"
            });
        }

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('agregarUsuario'));
            modal.hide(); // Cerrar el modal
            loadUsuarios(); // Refrescar el listado
        } else {
            console.error("Sucedió un error");
        }
    });

    document.getElementById('agregarUsuario').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('usuarioForm').reset();
        }
    });

    document.getElementById("agregarUsuario").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    // Cargar usuarios al inicio
    loadUsuarios();
});
