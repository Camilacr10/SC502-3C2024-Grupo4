document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    let mascotas = [];
    const API_URL = 'backend/adminMascota.php';

    async function loadMascotas() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                mascotas = await response.json();
                renderMascotas(mascotas);
            } else {
                console.error("Error al cargar las mascotas");
            }
        } catch (err) {
            console.error(err);
        }
    }

    function renderMascotas(mascotas) {
        const mascotaList = document.getElementById('mascotaList');
        mascotaList.innerHTML = '';

        // Actualiza el contador
        document.getElementById('totalMascotas').innerHTML = `<i class="fas fa-paw"></i> ${mascotas.length}`;


        mascotas.forEach(function (mascota) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mascota.nombre}</td>
                <td>${mascota.edad}</td>
                <td>${mascota.especie}</td>
                <td>${mascota.raza}</td>
                <td>${mascota.peso} kg</td>
                <td>${mascota.sexo}</td>
                <td>${mascota.castrado ? "1" : "0"}</td>
                <td>${mascota.vacunado ? "1" : "0"}</td>
                <td>${mascota.desparasitado ? "1" : "0"}</td>
                <td>${mascota.disponibilidad ? "1" : "0"}</td>
                <td>
                    <button class="btn btn-success btn-sm edit-mascota" data-id="${mascota.id_mascota}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-mascota" data-id="${mascota.id_mascota}">Eliminar</button>
                </td>
            `;
            mascotaList.appendChild(row);
        });

        document.querySelectorAll('.edit-mascota').forEach(button =>
            button.addEventListener('click', handleEditMascota)
        );
        document.querySelectorAll('.delete-mascota').forEach(button =>
            button.addEventListener('click', handleDeleteMascota)
        );
    }

    function handleEditMascota(event) {
        try {
            const mascotaId = parseInt(event.target.dataset.id);
            const mascota = mascotas.find(m => m.id_mascota === mascotaId);

            document.getElementById('nombre').value = mascota.nombre;
            document.getElementById('edad').value = mascota.edad;
            document.getElementById('especie').value = mascota.especie;
            document.getElementById('raza').value = mascota.raza;
            document.getElementById('peso').value = mascota.peso;
            document.getElementById('sexo').value = mascota.sexo;
            document.getElementById('castrado').value = mascota.castrado ? "1" : "0";
            document.getElementById('vacunado').value = mascota.vacunado ? "1" : "0";
            document.getElementById('desparasitado').value = mascota.desparasitado ? "1" : "0";
            document.getElementById('descripcion').value = mascota.descripcion;
            document.getElementById('fecha_rescate').value = mascota.fecha_rescate;
            document.getElementById('ruta_imagen').value = mascota.ruta_imagen;
            document.getElementById('disponibilidad').value = mascota.disponibilidad ? "1" : "0";

            isEditMode = true;
            edittingId = mascotaId;

            const modal = new bootstrap.Modal(document.getElementById('agregarMascota'));
            modal.show();

        } catch (error) {
            alert("Error trying to edit a pet");
            console.error(error);
        }
    }

    async function handleDeleteMascota(event) {
        const mascotaId = parseInt(event.target.dataset.id);

        const response = await fetch(`${API_URL}?id_mascota=${mascotaId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadMascotas();
        } else {
            console.error("Error al eliminar la mascota");
        }
    }

    document.getElementById('mascotaForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const edad = parseInt(document.getElementById("edad").value);
        const especie = document.getElementById("especie").value;
        const raza = document.getElementById("raza").value;
        const peso = parseFloat(document.getElementById("peso").value);
        const sexo = document.getElementById("sexo").value;
        const castrado = parseInt(document.getElementById("castrado").value);
        const vacunado = parseInt(document.getElementById("vacunado").value);
        const desparasitado = parseInt(document.getElementById("desparasitado").value);
        const descripcion = document.getElementById("descripcion").value;
        const fecha_rescate = document.getElementById("fecha_rescate").value;
        const ruta_imagen = document.getElementById("ruta_imagen").value;
        const disponibilidad = parseInt(document.getElementById("disponibilidad").value);

        let response; //variable para almacenar la respuesta temporal

        if (isEditMode) {
            response = await fetch(`${API_URL}?id_mascota=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    edad: edad,
                    especie: especie,
                    raza: raza,
                    peso: peso,
                    sexo: sexo,
                    castrado: castrado,
                    vacunado: vacunado,
                    desparasitado: desparasitado,
                    descripcion: descripcion,
                    fecha_rescate: fecha_rescate,
                    ruta_imagen: ruta_imagen,
                    disponibilidad: disponibilidad,
                }),
                credentials: 'include'
            });
        } else {
            const newMascota = {
                nombre: nombre,
                edad: edad,
                especie: especie,
                raza: raza,
                peso: peso,
                sexo: sexo,
                castrado: castrado,
                vacunado: vacunado,
                desparasitado: desparasitado,
                descripcion: descripcion,
                fecha_rescate: fecha_rescate,
                ruta_imagen: ruta_imagen,
                disponibilidad: disponibilidad
            };

            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMascota),
                credentials: "include"
            });
        }

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('agregarMascota'));
            modal.hide(); // Cerrar el modal
            loadMascotas(); // Refrescar el listado
        } else {
            console.error("Sucedió un error");
        }
    });

    document.getElementById('agregarMascota').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('mascotaForm').reset();
        }
    });

    document.getElementById("agregarMascota").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    });

    loadMascotas();
});
