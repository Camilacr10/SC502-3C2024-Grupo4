document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'backend/donaciones.php';

    async function enviarDonacion() {
        const formData = {
            monto: document.getElementById('donationAmount').value,
            nombre_donante: document.getElementById('cardholderName').value,
            email_donante: document.getElementById('email').value,
            metodo_pago: "Tarjeta",
            numero_tarjeta: document.getElementById('cardNumber').value,
            fecha_expiracion: document.getElementById('expirationDate').value,
            codigo_seguridad: document.getElementById('securityCode').value,
            fecha_donacion: new Date().toISOString().split('T')[0]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Donación creada:', data);

            const successModal = new bootstrap.Modal(document.getElementById('successModal'), {
                keyboard: false
            });
            successModal.show();
        } else {
            console.error('Error:', data.error);
        }
    }

    document.getElementById('donationForm').addEventListener('submit', function (event) {
        event.preventDefault();
        enviarDonacion();
    });
});
