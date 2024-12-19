document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('loginForm');
    const loginError = document.getElementById('login-error');

    form.addEventListener('submit',async function(e){
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
      
        try{
            //Enviar la solicitud al servidor:
            const response = await fetch('backend/login.php',{
                method: 'POST',
                header: {
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({username: username, password: password})
            });
            const result = await response.json();

            if(response.ok){
                // Redirigir según el rol
                if(result.role === 1) {
                    window.location.href = "inicioAdmin.html";
                } else if(result.role === 2) {
                    window.location.href = "Index.html";
                } else {
                    throw new Error("Rol no válido");
                }
            } else {
                loginError.style.display = 'block';
                loginError.textContent = result.error || 'Usuario o contraseña incorrectos';
            }
        } catch (error) {
            loginError.style.display = 'block';
            loginError.textContent = 'Hubo un error procesando tu solicitud';
            console.error(error);
        }
    });
});