document.addEventListener('DOMContentLoaded', () => {
  const contactoForm = document.getElementById('contactoForm');

  if (contactoForm) {
    contactoForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = document.getElementById('nombreContacto').value.trim();
      const email = document.getElementById('emailContacto').value.trim();
      const mensaje = document.getElementById('mensajeContacto').value.trim();

      // 1. Validar Nombre
      if (nombre === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo Requerido',
          text: 'Por favor, ingresa tu nombre.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }
      if (nombre.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre muy largo',
          text: 'El nombre no puede exceder los 100 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar Correo Electrónico
      if (email.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Correo muy largo',
          text: 'El correo no puede exceder los 100 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') ||
                           emailLower.endsWith('@profesor.duoc.cl') ||
                           emailLower.endsWith('@gmail.com');

      if (!correoValido) {
        Swal.fire({
          icon: 'error',
          title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar Comentario / Mensaje
      if (mensaje === '') {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje Requerido',
          text: 'Por favor, escribe un mensaje.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }
      if (mensaje.length > 500) {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje muy largo',
          text: 'El mensaje no puede superar los 500 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // Éxito
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje Enviado!',
        text: 'Gracias por contactarnos. Nuestro equipo de soporte te responderá a la brevedad.',
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      });

      this.reset();
    });
  }
});