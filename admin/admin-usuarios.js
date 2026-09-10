const regionesYComunasAdmin = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "La Florida"]
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"]
  },
  {
    region: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles", "Chillán"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  let usuarios = [
    { run: '19011022K', nombre: 'Gonzalo', apellidos: 'Pérez', email: 'admin@duoc.cl', tipo: 'Administrador', comuna: 'Santiago' },
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

      // 1. Validar RUN Estricto (7 a 9 caracteres, sin puntos ni guion, solo números y termina en número o K/k)
      const runRegex = /^\d{6,8}[0-9kK]$/;
      if (!runRegex.test(run)) {
        Swal.fire({
          icon: 'error',
          title: 'RUN Inválido',
          text: 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion, y solo puede contener números o terminar en la letra K (Ej: 19011022K).',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar Nombre (Max 50) y Apellidos (Max 100)
      if (nombre === '' || nombre.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre Inválido',
          text: 'El nombre es obligatorio y no puede superar los 50 caracteres.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      if (apellidos === '' || apellidos.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Apellidos Inválidos',
          text: 'Los apellidos son obligatorios y no pueden superar los 100 caracteres.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar Correo Electrónico (Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com)
      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') || 
                           emailLower.endsWith('@duocuc.cl') ||
                           emailLower.endsWith('@profesor.duoc.cl') || 
                           emailLower.endsWith('@gmail.com');

      if (!correoValido || email.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com (máximo 100 caracteres).',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Rol (Exclusivo vista admin: Administrador, Cliente, Vendedor)
      if (tipo === '') {
        Swal.fire({
          icon: 'error',
          title: 'Rol Requerido',
          text: 'Debes seleccionar un Tipo de Usuario (Administrador, Cliente o Vendedor).',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. Validar Comuna
      if (comuna === '') {
        Swal.fire({
          icon: 'error',
          title: 'Comuna Requerida',
          text: 'Debes seleccionar una comuna.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 6. Validar Dirección (Max 300)
      if (direccion === '' || direccion.length > 300) {
        Swal.fire({
          icon: 'error',
          title: 'Dirección Inválida',
          text: 'La dirección es obligatoria y no puede exceder los 300 caracteres.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      usuarios.push({ run, nombre, apellidos, email, tipo, comuna });

      Swal.fire({
        icon: 'success',
        title: '¡Usuario Creado!',
        text: `El usuario ${nombre} ${apellidos} fue registrado con el rol de ${tipo}.`,
        background: '#111',
        color: '#39FF14',
        confirmButtonColor: '#1E90FF'
      });

      renderizarTabla();
      this.reset();
      comunaSelect.disabled = true;
    });
  }

  renderizarTabla();
});
