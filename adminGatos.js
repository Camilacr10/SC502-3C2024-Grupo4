document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;
    const gatos = [
        { id: 1, nombre: "Pulguita", edad: 2, sexo: "M", castrado: "Sí", disponibilidad: "Disponible" },
        { id: 2, nombre: "Bigotes", edad: 3, sexo: "H", castrado: "No", disponibilidad: "Disponible" }
    ];

    // Función para actualizar el conteo total de gatitos
    function updateTotalGatos() {
        document.getElementById('totalGatos').innerHTML = `<i class="fas fa-cat"></i> ${gatos.length}`;
    }

    // Función para cargar y mostrar la lista de gatos
    function loadGatos() {
        const gatoList = document.getElementById('gatoList');
        gatoList.innerHTML = '';

        gatos.forEach(gato => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${gato.nombre}</td>
                <td>${gato.edad}</td>
                <td>${gato.sexo}</td>
                <td>${gato.castrado}</td>
                <td>${gato.disponibilidad}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-gato" data-id="${gato.id}">Eliminar</button>
                    <button class="btn btn-success btn-sm edit-gato" data-id="${gato.id}">Modificar</button>
                </td>
            `;
            gatoList.appendChild(row);
        });

        // Añadir eventos de clic para editar y eliminar
        document.querySelectorAll('.edit-gato').forEach(button => button.addEventListener('click', handleEditGato));
        document.querySelectorAll('.delete-gato').forEach(button => button.addEventListener('click', handleDeleteGato));

        // Actualizar el total de gatos
        updateTotalGatos();
    }

    function handleEditGato(event) {
        const gatoId = parseInt(event.target.dataset.id);
        const gato = gatos.find(g => g.id === gatoId);

        document.getElementById('nombre').value = gato.nombre;
        document.getElementById('edad').value = gato.edad;
        document.getElementById('sexo').value = gato.sexo;
        document.getElementById('castrado').value = gato.castrado;
        document.getElementById('disponibilidad').value = gato.disponibilidad;

        isEditMode = true;
        edittingId = gatoId;

        const modal = new bootstrap.Modal(document.getElementById('agregarGato'));
        modal.show();
    }

    function handleDeleteGato(event) {
        const gatoId = parseInt(event.target.dataset.id);
        const index = gatos.findIndex(g => g.id === gatoId);
        gatos.splice(index, 1);
        loadGatos();
    }

    document.getElementById('gatoForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const sexo = document.getElementById('sexo').value;
        const castrado = document.getElementById('castrado').value;
        const disponibilidad = document.getElementById('disponibilidad').value;

        if (isEditMode) {
            const gato = gatos.find(g => g.id === edittingId);
            gato.nombre = nombre;
            gato.edad = edad;
            gato.sexo = sexo;
            gato.castrado = castrado;
            gato.disponibilidad = disponibilidad;
        } else {
            const newGato = {
                id: gatos.length + 1,
                nombre: nombre,
                edad: edad,
                sexo: sexo,
                castrado: castrado,
                disponibilidad: disponibilidad
            };
            gatos.push(newGato);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('agregarGato'));
        modal.hide();
        isEditMode = false;
        edittingId = null;
        loadGatos();
    });

    document.getElementById('agregarGato').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('gatoForm').reset();
        }
    });

    loadGatos();
});
