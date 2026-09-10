const regionesYComunasAdmin = [
  { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto"] },
  { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Concón"] },
  { region: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles"] }
];

document.addEventListener('DOMContentLoaded', () => {
  let usuarios = [
    { run: '19011022K', nombre: 'Gonzalo', apellidos: 'Pérez', email: 'gonzalo@duoc.cl', tipo: 'Administrador', comuna: 'Santiago' },
    { run: '184445551', nombre: 'María', apellidos: 'López', email: 'maria@gmail.com', tipo: 'Cliente', comuna: 'Providencia' }
  ];

  const regionSelect = document.getElementById('usrRegion');
  const comunaSelect = document.getElementById('usrComuna');

  if (regionSelect) {
    regionesYComunasAdmin.forEach((item, index) => {
      let opt = document.createElement('option');
      opt.value = index;
      opt.textContent = item.region;
      regionSelect.appendChild(opt);
    });

    regionSelect.addEventListener('change', (e) => {
      const idx = e.target.value;
      comunaSelect.innerHTML = '<option value="">-- Selecciona Comuna --</option>';
      if (idx !== "") {
        comunaSelect.disabled = false;
        regionesYComunasAdmin[idx].comunas.forEach(comuna => {
          let opt = document.createElement('option');
          opt.value = comuna;
          opt.textContent = comuna;
          comunaSelect.appendChild(opt);
        });
      } else {
        comunaSelect.disabled = true;
      }
    });
  }

  function renderizarTabla() {
    const tbody = document.getElementById('tablaUsuariosAdmin');
    if (!tbody) return;
    tbody.innerHTML = '';

    usuarios.forEach((u, index) => {
      tbody.innerHTML += `
        <tr>
          <td>${u.run}</td>
          <td>${u.nombre} ${u.apellidos}</td>
          <td>${u.email}</td>
          <td><span class="badge bg-info text-dark">${u.tipo}</span></td>
          <td>${u.comuna}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  window.eliminarUsuario = function(index) {
    usuarios.splice(index, 1);
    renderizarTabla();
  };

  const usrForm = document.getElementById('usuarioForm');
  if (usrForm) {
    usrForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const run = document.getElementById('usrRun').value.trim();
      const nombre = document.getElementById('usrNombre').value.trim();
      const apellidos = document.getElementById('usrApellidos').value.trim();
      const email = document.getElementById('usrEmail').value.trim();
      const tipo = document.getElementById('usrTipo').value;
      const comuna = document.getElementById('usrComuna').value;
      const direccion = document.getElementById('usrDireccion').value.trim();

      // 1. Validar RUN (7 a 9 caracteres sin puntos ni guion)
      if (run.length < 7 || run.length > 9 || run.includes('.') || run.includes('-')) {
        Swal.fire({
          icon: 'error', title: 'RUN Inválido',
          text: 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar Correo Electrónico
      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') || 
                           emailLower.endsWith('@profesor.duoc.cl') || 
                           emailLower.endsWith('@gmail.com');

      if (!correoValido || email.length > 100) {
        Swal.fire({
          icon: 'error', title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com (Max 100 caracteres).',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar Rol
      if (tipo === '') {
        Swal.fire({
          icon: 'error', title: 'Rol Requerido',
          text: 'Debes seleccionar un Tipo de Usuario (Administrador, Cliente o Vendedor).',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Dirección
      if (direccion === '' || direccion.length > 300) {
        Swal.fire({
          icon: 'error', title: 'Dirección Inválida',
          text: 'La dirección es obligatoria y no puede exceder los 300 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      usuarios.push({ run, nombre, apellidos, email, tipo, comuna });

      Swal.fire({
        icon: 'success', title: '¡Usuario Creado!',
        text: `El usuario ${nombre} ${apellidos} fue registrado con el rol de ${tipo}.`,
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      });

      renderizarTabla();
      this.reset();
      comunaSelect.disabled = true;
    });
  }

  renderizarTabla();
});
