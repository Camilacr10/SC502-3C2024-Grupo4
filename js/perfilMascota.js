document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/perfilMascota.php';
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get('id');


    async function loadMascota(idMascota) {
        try {
            const response = await fetch(`${API_URL}?id_mascota=${idMascota}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                // Procesar directamente como JSON
                const mascota = await response.json();
                renderMascotas(mascota); // Llama a la función de renderizado
            } else {
                console.error(`Error HTTP: ${response.status}`);
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }
    }

    function renderMascotas(mascota) {
        const imagenContenedor = document.getElementById('imagen-cotenedor');
        const imagenMascota = document.createElement('img');
        imagenMascota.className = 'img-fluid estilo-imagen';
        imagenMascota.src = `${mascota.ruta_imagen}`;
        imagenContenedor.appendChild(imagenMascota);

        const nombreMascota = document.getElementById('nombre-mascota');
        nombreMascota.textContent = mascota.nombre;

        const especieMascota = document.getElementById('especie-mascota');
        especieMascota.textContent = mascota.especie;

        const razaMascota = document.getElementById('raza-mascota');
        razaMascota.textContent = mascota.raza;

        const pesoMascota = document.getElementById('peso-mascota');
        pesoMascota.textContent = mascota.peso + 'kg';

        const edadMascota = document.getElementById('edad-mascota');
        edadMascota.textContent = mascota.edad + ' año(s)';

        const sexoMascota = document.getElementById('sexo-mascota');
        sexoMascota.textContent = mascota.sexo;

        const descripcionMascota = document.getElementById('descripcion-mascota');
        descripcionMascota.textContent = mascota.descripcion;

        const ulRequisitos = document.getElementById('requisitos-mascota');
        ulRequisitos.className = 'requirement-item';

        mascota.requisitos.forEach(function (requisito) {
            const liRequisito = document.createElement('li');
            liRequisito.textContent = requisito.descripcion;
            ulRequisitos.appendChild(liRequisito);
        });


        agregarDatoMedico(mascota.vacunado, 'img/perfilMascota/vacunacion.jpg', 'Vacunado');
        agregarDatoMedico(mascota.desparasitado, 'img/perfilMascota/desparasitacion.png', 'Desparacitado');
        agregarDatoMedico(mascota.castrado, 'img/perfilMascota/castracion.png', 'Castrado');


    }

    function agregarDatoMedico(condicion, imagenSrc, titulo) {
        const contenedorDatosMedicos = document.getElementById('contenedor-datos-medicos');

        const datocContenedor = document.createElement('div');
        datocContenedor.className = 'box';

        const imagenDato = document.createElement('img');
        imagenDato.className = 'box-img';
        imagenDato.src = imagenSrc;

        const tituloDato = document.createElement('h6');
        tituloDato.className = 'text-center mt-1 box-title';

        if (condicion) {
            tituloDato.textContent = titulo;
        } else {
            tituloDato.textContent = `No ${titulo}`;
        }

        datocContenedor.appendChild(imagenDato);
        datocContenedor.appendChild(tituloDato);

        contenedorDatosMedicos.appendChild(datocContenedor);
    }

    if (idMascota) {
        loadMascota(idMascota);
    } else {
        console.error('No se proporcionó un ID de mascota.');
    }

    document.getElementById('adoptar-btn').addEventListener('click', function () {
        const idMascota = new URLSearchParams(window.location.search).get('id');
        if (idMascota) {
            window.location.href = `perfilAdopciones.html?id=${idMascota}#formulario-adopcion`;
        }
    });
});
