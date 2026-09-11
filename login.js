document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      // 1. Validar Correo y Contraseña ingresados
      if (email === '' || password === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campos Requeridos',
          text: 'Por favor, ingresa tu correo y contraseña.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar que exista exactamente un solo '@'
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

      // 3. Validar Dominios Permitidos
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

      // 4. BUSCAR EN LOCALSTORAGE Y REVISAR CONTRASEÑA
      const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosAdmin')) || [
        { run: '19011022K', nombre: 'Gonzalo', apellidos: 'Pérez', email: 'admin@duoc.cl', password: 'admin', tipo: 'Administrador', comuna: 'Santiago' }
      ];

      const usuarioEncontrado = usuariosRegistrados.find(
        usr => usr.email && usr.email.toLowerCase() === emailLower
      );

      const esAdminPorDefecto = (emailLower === 'admin@duoc.cl' || emailLower === 'admin@profesor.duoc.cl');

      // Si el correo no está registrado
      if (!usuarioEncontrado && !esAdminPorDefecto) {
        Swal.fire({
          icon: 'error',
          title: 'Cuenta No Encontrada',
          text: 'No existe ninguna cuenta registrada con este correo electrónico. Por favor, regístrate primero.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // Verificar contraseña
      if (usuarioEncontrado && usuarioEncontrado.password && usuarioEncontrado.password !== password) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Incorrecta',
          text: 'La contraseña ingresada no coincide con nuestros registros.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. GUARDAR SESIÓN Y REDIRIGIR
      const usuarioSesion = usuarioEncontrado || {
        nombre: 'Administrador',
        email: emailLower,
        tipo: 'Administrador'
      };

      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioSesion));

      if (esAdminPorDefecto || usuarioSesion.tipo === 'Administrador') {
        Swal.fire({
          icon: 'success',
          title: '¡Sesión de Administrador!',
          text: 'Bienvenido al panel de administración.',
          background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
        }).then(() => {
          window.location.href = 'admin/index.html';
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido(a)!',
          text: `Hola ${usuarioSesion.nombre}, has iniciado sesión correctamente.`,
          background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
        }).then(() => {
          window.location.href = 'index.html';
        });
      }
    });
  }
});
