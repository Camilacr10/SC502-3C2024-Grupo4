document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    let adopciones = [];
    let usuarios = []; // Para almacenar usuarios
    let mascotas = []; // Para almacenar mascotas
    const API_URL = 'backend/adminAdopciones.php';
    const API_URL_MASCOTAS = 'backend/listadoMascotas.php';
    const API_URL_USUARIOS = 'backend/adminUsuarios.php';

    async function loadAdopciones() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const text = await response.text(); // Lee la respuesta como texto
                adopciones = JSON.parse(text); // Intenta parsear como JSON
                renderAdopciones(adopciones);
            } else {
                console.error(`Error HTTP: ${response.status}`);
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }
    }

    async function obtenerMascotas() {
        try {
            const response = await fetch(API_URL_MASCOTAS, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                mascotas = await response.json(); // Guarda las mascotas en la variable global
                llenarDropdownMascotas(mascotas); // Llama a la función para llenar el dropdown
            } else {
                console.error('Error al obtener las mascotas:', response.status);
            }
        } catch (error) {
            console.error('Error al hacer fetch:', error);
        }
    }

    async function obtenerUsuarios() {
        try {
            const response = await fetch(API_URL_USUARIOS, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                usuarios = await response.json(); // Guarda los usuarios en la variable global
                llenarDropdownUsuarios(usuarios); // Llama a la función para llenar el dropdown
            } else {
                console.error("Error al cargar los usuarios");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderAdopciones(adopciones) {
        const adopcionList = document.getElementById('adopcionList');
        adopcionList.innerHTML = '';

        // Actualiza el contador
        document.getElementById('totalAdopciones').innerHTML = `<i class="fas fa-hand-holding-usd"></i> ${adopciones.length}`;

        adopciones.forEach(function (adopcion) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${adopcion.usuario_nombre}</td>
                <td>${adopcion.mascota_nombre}</td>
                <td>${adopcion.fecha_solicitud}</td>
                <td>${adopcion.estado}</td>
                <td>${adopcion.descripcion}</td>
                <td>
                    <button class="btn btn-primary btn-sm edit-adopcion" data-id="${adopcion.id_adopcion}">Editar</button>
                    <button class="btn btn-success btn-sm approve-adopcion" data-id="${adopcion.id_adopcion}">Aprobar</button>
                    <button class="btn btn-danger btn-sm delete-adopcion" data-id="${adopcion.id_adopcion}">Eliminar</button>
                </td>
            `;
            adopcionList.appendChild(row);

            document.querySelectorAll('.approve-adopcion').forEach(function (button) {
                button.addEventListener('click', handleApproveAdopcion);
            });

            document.querySelectorAll('.edit-adopcion').forEach(function (button) {
                button.addEventListener('click', handleEditAdopcion);
            });

            document.querySelectorAll('.delete-adopcion').forEach(function (button) {
                button.addEventListener('click', handleDeleteAdopcion);
            });
        });
    }

    function llenarDropdownMascotas(mascotas) {
        const mascotaSelect = document.getElementById('mascota');
        mascotaSelect.innerHTML = '<option value=""></option>';

        mascotas.forEach(mascota => {
            const option = document.createElement('option');
            option.value = mascota.id_mascota; // El ID es el valor
            option.textContent = mascota.nombre; // El nombre es lo que se muestra
            mascotaSelect.appendChild(option);
        });
    }

    function llenarDropdownUsuarios(usuarios) {
        const usuarioSelect = document.getElementById('usuario');
        usuarioSelect.innerHTML = '<option value=""></option>';

        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.id_usuario; // El ID es el valor
            option.textContent = usuario.nombre; // El nombre es lo que se muestra
            usuarioSelect.appendChild(option);
        });
    }

    async function handleEditAdopcion(event) {
        try {
            const id_adopcion = parseInt(event.target.dataset.id);
            const adopcion = adopciones.find(a => a.id_adopcion === id_adopcion);
            console.log(adopcion);

            // Asignar los valores a los campos (ID del usuario y mascota)
            document.getElementById('usuario').value = adopcion.usuario_id;
            document.getElementById('mascota').value = adopcion.mascota_id;
            document.getElementById('fecha_solicitud').value = adopcion.fecha_solicitud;
            document.getElementById('estado').value = adopcion.estado;
            document.getElementById('descripcion').value = adopcion.descripcion;

            // Establece el modo de edición y guarda el id de la adopción
            isEditMode = true;
            edittingId = id_adopcion;

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('agregarAdopcion'));
            modal.show();
        } catch (error) {
            alert("Error intentando editar la adopción");
            console.error(error);
        }
    }

    async function handleApproveAdopcion(event) {
        try {
            const id_adopcion = parseInt(event.target.dataset.id);
            const adopcion = adopciones.find(a => a.id_adopcion === id_adopcion);

            let response;

            response = await fetch(`${API_URL}?id_adopcion=${id_adopcion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: adopcion.id_usuario,
                    id_mascota: adopcion.id_mascota,
                    fecha_solicitud: adopcion.fecha_solicitud,
                    estado: 'Completado',
                    descripcion: adopcion.descripcion
                }),
                credentials: 'include'
            });
            if (response.ok) {
                loadAdopciones();  // Recarga las adopciones después de la edición
            } else {
                console.error("Sucedió un error");
            }
        }

        catch (error) {
            alert("Error intentando editar la adopción");
            console.error(error);
        }
    }


    document.getElementById('adopcionForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const mascota = document.getElementById('mascota').value;
        const fecha_solicitud = document.getElementById('fecha_solicitud').value;
        const estado = document.getElementById('estado').value;
        const descripcion = document.getElementById('descripcion').value;

        let response;

        if (isEditMode) {
            response = await fetch(`${API_URL}?id_adopcion=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: usuario,
                    id_mascota: mascota,
                    fecha_solicitud: fecha_solicitud,
                    estado: estado,
                    descripcion: descripcion
                }),
                credentials: 'include'
            });
        } else {
            const newAdopcion = {
                id_usuario: usuario,
                id_mascota: mascota,
                fecha_solicitud: fecha_solicitud,
                estado: estado,
                descripcion: descripcion
            };

            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAdopcion),
                credentials: "include"
            });
        }

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('agregarAdopcion'));
            modal.hide();
            loadAdopciones();  // Recarga las adopciones después de la edición
        } else {
            console.error("Sucedió un error");
        }
    });

    async function handleDeleteAdopcion(event) {
        const id_adopcion = parseInt(event.target.dataset.id);

        const response = await fetch(`${API_URL}?id_adopcion=${id_adopcion}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            console.log("Adopción eliminada con éxito");
            loadAdopciones();  // Recarga las adopciones después de la eliminación
        } else {
            console.error("Error al eliminar la adopción");
        }
    }

    document.getElementById('agregarAdopcion').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('adopcionForm').reset();
        }
    });

    document.getElementById("agregarAdopcion").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadAdopciones();
    obtenerMascotas();
    obtenerUsuarios();
});
