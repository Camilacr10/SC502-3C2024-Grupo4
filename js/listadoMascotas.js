document.addEventListener('DOMContentLoaded', function () {
    let mascotas = [];
    const API_URL = 'backend/listadoMascotas.php';

    async function loadMascotas() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include',
            });
    
            if (response.ok) {
                const text = await response.text(); // Lee la respuesta como texto
                try {
                    mascotas = JSON.parse(text); // Intenta parsear como JSON
                    renderMascotas(mascotas);
                } catch (jsonError) {
                    console.error("La respuesta no es un JSON válido:", text);
                }
            } else {
                console.error(`Error HTTP: ${response.status}`);
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }
    }

    function renderMascotas(mascotas) {
        const mascotasList = document.getElementById('mascotas-list');
        mascotasList.innerHTML = '';
        mascotas.forEach(function (mascota) {
            const mascotaCard = document.createElement('div');
            mascotaCard.className = 'col-3';
            mascotaCard.innerHTML = `
            <div class="pet-card">
                <div class="pet-image">
                    <img src="${mascota.ruta_imagen}" alt="${mascota.nombre}">
                </div>
                <div class="pet-info rounded-pill">
                    ${mascota.nombre}<br>
                    <a href="perfilMascota.html?id=${mascota.id_mascota}">
                <button class="btn btn-warning rounded-pill">Información</button>
            </a>
                </div>
            </div>
        </div>
        `;
            mascotasList.appendChild(mascotaCard);
        });
    }
    loadMascotas();
});
