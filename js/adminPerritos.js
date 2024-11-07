document.addEventListener('DOMContentLoaded', function () {
    let isEditMode = false;
    let edittingId;

    const perritos = [
        { id: 1, nombre: "Firulais", edad: 3, sexo: "M", castrado: "Sí", disponibilidad: "Disponible" },
        { id: 2, nombre: "Pelusa", edad: 5, sexo: "H", castrado: "No", disponibilidad: "Disponible" }
    ];

    // Función para actualizar el conteo total de perritos
    function updateTotalPerritos() {
        document.getElementById('totalPerritos').innerHTML = `<i class="fas fa-dog"></i> ${perritos.length}`;
    }

    // Función para cargar y mostrar la lista de perritos
    function loadPerritos() {
        const perritoList = document.getElementById('perritoList');
        perritoList.innerHTML = '';

        perritos.forEach(perrito => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${perrito.nombre}</td>
                <td>${perrito.edad}</td>
                <td>${perrito.sexo}</td>
                <td>${perrito.castrado}</td>
                <td>${perrito.disponibilidad}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-perrito" data-id="${perrito.id}">Eliminar</button>
                    <button class="btn btn-success btn-sm edit-perrito" data-id="${perrito.id}">Modificar</button>
                </td>
            `;
            perritoList.appendChild(row);
        });

        // Añadir eventos de clic para editar y eliminar
        document.querySelectorAll('.edit-perrito').forEach(button => button.addEventListener('click', handleEditPerrito));
        document.querySelectorAll('.delete-perrito').forEach(button => button.addEventListener('click', handleDeletePerrito));

        // Actualizar el total de perritos
        updateTotalPerritos();
    }

    function handleEditPerrito(event) {
        const perritoId = parseInt(event.target.dataset.id);
        const perrito = perritos.find(p => p.id === perritoId);

        document.getElementById('nombre').value = perrito.nombre;
        document.getElementById('edad').value = perrito.edad;
        document.getElementById('sexo').value = perrito.sexo;
        document.getElementById('castrado').value = perrito.castrado;
        document.getElementById('disponibilidad').value = perrito.disponibilidad;

        isEditMode = true;
        edittingId = perritoId;

        const modal = new bootstrap.Modal(document.getElementById('agregarPerrito'));
        modal.show();
    }

    function handleDeletePerrito(event) {
        const perritoId = parseInt(event.target.dataset.id);
        const index = perritos.findIndex(p => p.id === perritoId);
        perritos.splice(index, 1);
        loadPerritos();
    }

    document.getElementById('perritoForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const edad = document.getElementById('edad').value;
        const sexo = document.getElementById('sexo').value;
        const castrado = document.getElementById('castrado').value;
        const disponibilidad = document.getElementById('disponibilidad').value;

        if (isEditMode) {
            const perrito = perritos.find(p => p.id === edittingId);
            perrito.nombre = nombre;
            perrito.edad = edad;
            perrito.sexo = sexo;
            perrito.castrado = castrado;
            perrito.disponibilidad = disponibilidad;
        } else {
            const newPerrito = {
                id: perritos.length + 1,
                nombre: nombre,
                edad: edad,
                sexo: sexo,
                castrado: castrado,
                disponibilidad: disponibilidad
            };
            perritos.push(newPerrito);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('agregarPerrito'));
        modal.hide();
        isEditMode = false;
        edittingId = null;
        loadPerritos();
    });

    document.getElementById('agregarPerrito').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('perritoForm').reset();
        }
    });

    loadPerritos();
});
