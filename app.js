
document.getElementById('registroForm').addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    let nombre = document.getElementById('nombre').value;
    let email = document.getElementById('email').value;
    let fechaNacimiento = document.getElementById('fechaNacimiento').value;
    let referido = document.getElementById('referido').value;
    let mensajeApp = document.getElementById('mensajeApp');
    mensajeApp.innerHTML = "";


    if (nombre.trim() === "" || email.trim() === "" || fechaNacimiento === "") {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Debes completar todos los campos obligatorios.',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }


    let fechaNac = new Date(fechaNacimiento);
    let hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    let mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    if (edad < 18) {
         Swal.fire({
            icon: 'warning',
            title: 'Acceso Denegado',
            text: 'Debes ser mayor de 18 años para registrarte en Level-Up Gamer.',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#1E90FF'
        });
        return;
    }


    let mensajeExito = `¡Bienvenido a Level-Up Gamer, ${nombre}!`;
    
    if (email.toLowerCase().includes("@duocuc.cl") || email.toLowerCase().includes("@duoc.cl")) {
        mensajeExito += "\n🎉 Se ha aplicado tu descuento del 20% de por vida.";
    }

    if (referido.trim() !== "") {
        mensajeExito += "\n🎮 Has ganado Puntos LevelUp iniciales.";
    }


    Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: mensajeExito,
        background: '#111',
        color: '#39FF14', 
        confirmButtonColor: '#1E90FF'
    });

    this.reset();
});