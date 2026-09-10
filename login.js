document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      // 1. Validar Correo Requerido
      if (email === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo Requerido',
          text: 'Por favor, ingresa tu correo electrónico.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar Largo de Correo (Max 100)
      if (email.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Correo demasiado largo',
          text: 'El correo electrónico no puede superar los 100 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar Dominios Permitidos (@duoc.cl, @profesor.duoc.cl, @gmail.com)
      const emailLower = email.toLowerCase();
      const dominioValido = emailLower.endsWith('@duoc.cl') || 
                            emailLower.endsWith('@profesor.duoc.cl') || 
                            emailLower.endsWith('@gmail.com');

      if (!dominioValido) {
        Swal.fire({
          icon: 'error',
          title: 'Dominio No Permitido',
          text: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Contraseña Requerida
      if (password === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo Requerido',
          text: 'Por favor, ingresa tu contraseña.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. Validar Largo de Contraseña (Entre 4 y 10 caracteres)
      if (password.length < 4 || password.length > 10) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Inválida',
          text: 'La contraseña debe tener entre 4 y 10 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Sesión Iniciada!',
        text: `Bienvenido de nuevo, ${email}`,
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      }).then(() => {
        // Redireccionar al inicio tras iniciar sesión
        window.location.href = 'index.html';
      });
    });
  }
});
