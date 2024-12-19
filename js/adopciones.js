document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/adopciones.php';
    const API_URL_Mascotas = 'backend/listadoMascotas.php';
    const API_URL_Usuario = 'backend/usuario.php';
    const params = new URLSearchParams(window.location.search);
    const idMascota = params.get('id');
    const selectMascota = document.getElementById('mascota');

    async function obtenerMascotas() {
        try {
            const response = await fetch(API_URL_Mascotas, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const mascotas = await response.json();
                llenarDropdown(mascotas);

                if (idMascota) {
                    setMascotaSeleccionada(idMascota);
                }
            } else {
                console.error('Error al obtener las mascotas:', response.status);
            }
        } catch (error) {
            console.error('Error al hacer fetch:', error);
        }
    }

    function llenarDropdown(mascotas) {
        selectMascota.innerHTML = '<option value="">Selecciona una mascota</option>';

        mascotas.forEach(function (mascota) {
            const option = document.createElement('option');
            option.value = mascota.id_mascota;
            option.textContent = mascota.nombre;
            selectMascota.appendChild(option);
        });
    }

    function setMascotaSeleccionada(idMascota) {
        const opciones = selectMascota.querySelectorAll('option');
        opciones.forEach(function (option) {
            if (option.value == idMascota) {
                selectMascota.value = option.value;
            }
        });
    }

    document.getElementById('adopcionForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            const response = await fetch(API_URL_Usuario);
            const usuario = await response.json();

            if (response.ok) {
                let usuarioActivo = usuario;

                if (usuarioActivo === "Sesion no activa") {
                    window.location.href = "Login.html";
                } else {
                    const idMascota = document.getElementById('mascota').value;
                    const razones = document.getElementById('razones').value;

                    if (!idMascota || !razones) {
                        alert("Por favor, completa todos los campos.");
                        return;
                    }

                    const idUsuario = 1; // esto es temporal

                    const data = {
                        id_usuario: idUsuario,
                        id_mascota: idMascota,
                        descripcion: razones
                    };

                    fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message) {

                                const mensaje = document.createElement("div");
                                mensaje.className = "alert alert-success text-center mt-3";
                                mensaje.textContent = "¡Tu solicitud ha sido enviada exitosamente! Muchas gracias por adoptar.";

                                const formContainer = document.querySelector(".form-container");
                                formContainer.appendChild(mensaje);

                                this.reset();

                                setTimeout(() => {
                                    mensaje.remove();
                                }, 5000);

                                console.log(data.message); // Mostrar el mensaje de éxito
                            } else {
                                console.log("Hubo un error al enviar la solicitud. Inténtalo de nuevo.");
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            console.log("Hubo un error al enviar la solicitud. Inténtalo de nuevo.");
                        });
                }
            }
        } catch (err) {
            console.error("Error al hacer fetch:", err);
        }


    });

    obtenerMascotas();
});


