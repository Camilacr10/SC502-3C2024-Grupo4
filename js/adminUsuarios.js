document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;

    const usuarios = [
        { id: 1, nombre: "Diana", apellidos: "Ramírez", correo: "diana@gmail.com", activo: "Sí" },
        { id: 2, nombre: "Camila", apellidos: "Corrales", correo: "camila@gmail.com", activo: "Sí" },
        { id: 3, nombre: "Madeline", apellidos: "Araya", correo: "madeline@gmail.com", activo: "Sí" }
    ];

    // Función para actualizar el conteo total de usuarios
    function updateTotalUsuarios() {
        document.getElementById('totalUsuarios').innerHTML = `<i class="fas fa-user"></i> ${usuarios.length}`;
    }

    // Función para cargar y mostrar la lista de usuarios
    function loadUsuarios() {
        const usuarioList = document.getElementById('usuarioList');
        usuarioList.innerHTML = '';

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellidos}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.activo}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-usuario" data-id="${usuario.id}">Eliminar</button>
                    <button class="btn btn-success btn-sm edit-usuario" data-id="${usuario.id}">Modificar</button>
                </td>
            `;
            usuarioList.appendChild(row);
        });

        // Añadir eventos de clic para editar y eliminar
        document.querySelectorAll('.edit-usuario').forEach(button => button.addEventListener('click', handleEditUsuario));
        document.querySelectorAll('.delete-usuario').forEach(button => button.addEventListener('click', handleDeleteUsuario));

        // Actualizar el total de usuarios
        updateTotalUsuarios();
    }

    function handleEditUsuario(event) {
        const usuarioId = parseInt(event.target.dataset.id);
        const usuario = usuarios.find(u => u.id === usuarioId);

        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellidos').value = usuario.apellidos;
        document.getElementById('correo').value = usuario.correo;
        document.getElementById('activo').value = usuario.activo;

        isEditMode = true;
        edittingId = usuarioId;

        const modal = new bootstrap.Modal(document.getElementById('agregarUsuario'));
        modal.show();
    }

    function handleDeleteUsuario(event) {
        const usuarioId = parseInt(event.target.dataset.id);
        const index = usuarios.findIndex(u => u.id === usuarioId);
        usuarios.splice(index, 1);
        loadUsuarios();
    }

    document.getElementById('usuarioForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const correo = document.getElementById('correo').value;
        const activo = document.getElementById('activo').value;

        if (isEditMode) {
            const usuario = usuarios.find(u => u.id === edittingId);
            usuario.nombre = nombre;
            usuario.apellidos = apellidos;
            usuario.correo = correo;
            usuario.activo = activo;
        } else {
            const newUsuario = {
                id: usuarios.length + 1,
                nombre: nombre,
                apellidos: apellidos,
                correo: correo,
                activo: activo
            };
            usuarios.push(newUsuario);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('agregarUsuario'));
        modal.hide();
        isEditMode = false;
        edittingId = null;
        loadUsuarios();
    });

    document.getElementById('agregarUsuario').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('usuarioForm').reset();
        }
    });

    loadUsuarios();
});
