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

      // 3. Validar que tenga exactamente UN solo '@'
      const cantidadArrobas = (email.match(/@/g) || []).length;
      if (cantidadArrobas !== 1) {
        Swal.fire({
          icon: 'error',
          title: 'Correo Inválido',
          text: 'El correo electrónico debe contener exactamente un solo símbolo "@".',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Dominios Permitidos (@duoc.cl, @duocuc.cl, @profesor.duoc.cl, @gmail.com)
      const emailLower = email.toLowerCase();
      const dominioValido = emailLower.endsWith('@duoc.cl') || 
                            emailLower.endsWith('@duocuc.cl') ||
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

      // 5. Validar Contraseña Requerida
      if (password === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo Requerido',
          text: 'Por favor, ingresa tu contraseña.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 6. Validar Largo de Contraseña (Entre 4 y 10 caracteres)
      if (password.length < 4 || password.length > 10) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Inválida',
          text: 'La contraseña debe tener entre 4 y 10 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 7. VERIFICACIÓN DE CUENTA EXISTENTE EN LOCALSTORAGE
      // Lista de administradores base por defecto
      const administradoresBase = ['admin@duoc.cl', 'admin@profesor.duoc.cl'];
      
      // Obtener usuarios registrados desde localStorage
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];

      // Buscar si el correo ingresado existe en la base de datos local
      const usuarioEncontrado = usuariosRegistrados.find(
        usr => usr.email && usr.email.toLowerCase() === emailLower
      );

      const esAdmin = administradoresBase.includes(emailLower);

      // Si no es un admin por defecto Y tampoco existe en la lista de registrados
      if (!esAdmin && !usuarioEncontrado) {
        Swal.fire({
          icon: 'error',
          title: 'Cuenta no encontrada',
          text: 'No existe ninguna cuenta registrada con este correo electrónico. Por favor, crea una en la sección de Registro.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 8. REDIRECCIÓN SEGÚN ROL
      if (esAdmin || (usuarioEncontrado && usuarioEncontrado.tipo === 'Administrador')) {
        Swal.fire({
          icon: 'success',
          title: '¡Sesión de Administrador!',
          text: 'Bienvenido al sistema de gestión.',
          background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
        }).then(() => {
          window.location.href = 'admin/index.html';
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Sesión Iniciada!',
          text: `Bienvenido de nuevo, ${usuarioEncontrado ? usuarioEncontrado.nombre : email}`,
          background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
        }).then(() => {
          window.location.href = 'index.html';
        });
      }
    });
  }
});
