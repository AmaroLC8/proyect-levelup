document.addEventListener('DOMContentLoaded', () => {
  actualizarBarraSesion();
});

function actualizarBarraSesion() {
  const container = document.getElementById('navbarSesion');
  if (!container) return;

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

  if (usuarioLogueado) {
    // AQUÍ ESTABAN FALTANDO LAS COMILLAS INVERTIDAS (` `)
    container.innerHTML = `
      <li class="nav-item d-flex align-items-center me-2">
        <span class="text-neon fw-bold" style="font-size: 0.95rem;">👤 Hola, ${usuarioLogueado.nombre}</span>
      </li>
      <li class="nav-item">
        <button class="btn btn-sm btn-outline-danger me-1" onclick="eliminarMiCuenta()">Eliminar Cuenta</button>
      </li>
      <li class="nav-item">
        <button class="btn btn-sm btn-outline-light" onclick="cerrarSesion()">Cerrar Sesión</button>
      </li>
    `;
  } else {
    container.innerHTML = `
      <li class="nav-item"><a class="nav-link text-white" href="registro.html">Registro</a></li>
      <li class="nav-item"><a class="nav-link text-white fw-bold" href="login.html">Iniciar Sesión</a></li>
    `;
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuarioLogueado');
  Swal.fire({
    icon: 'info',
    title: 'Sesión Cerrada',
    text: 'Has cerrado sesión correctamente.',
    background: '#111', color: '#fff', confirmButtonColor: '#1E90FF',
    timer: 1500, showConfirmButton: false
  }).then(() => {
    window.location.href = 'index.html';
  });
}

function eliminarMiCuenta() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
  if (!usuarioLogueado) return;

  Swal.fire({
    title: '¿Eliminar tu cuenta?',
    text: 'Esta acción borrará tus datos permanentemente y no se podrá deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#1E90FF',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#111', color: '#fff'
  }).then((result) => {
    if (result.isConfirmed) {
      let usuarios = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];
      usuarios = usuarios.filter(u => u.email.toLowerCase() !== usuarioLogueado.email.toLowerCase());
      localStorage.setItem('usuariosAdmin', JSON.stringify(usuarios));
      localStorage.removeItem('usuarioLogueado');

      Swal.fire({
        icon: 'success',
        title: 'Cuenta Eliminada',
        text: 'Tu cuenta ha sido eliminada con éxito.',
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      }).then(() => {
        window.location.href = 'index.html';
      });
    }
  });
}
