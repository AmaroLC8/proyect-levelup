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

function validarRutChileno(rut) {
  rut = rut.trim().toUpperCase();
  const regex = /^\d{6,8}[0-9K]$/;
  if (!regex.test(rut)) return false;

  const cuerpo = rut.slice(0, -1);
  const dvIngresado = rut.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  let dvEsperado = 11 - resto;

  if (dvEsperado === 11) dvEsperado = '0';
  else if (dvEsperado === 10) dvEsperado = 'K';
  else dvEsperado = dvEsperado.toString();

  return dvIngresado === dvEsperado;
}

document.addEventListener('DOMContentLoaded', () => {
  const usuariosBase = [
    { run: '19011022K', nombre: 'Gonzalo', apellidos: 'Pérez', email: 'admin@duoc.cl', tipo: 'Administrador', comuna: 'Santiago' }
  ];

  let usuarios = JSON.parse(localStorage.getItem('usuariosAdmin')) || usuariosBase;

  function guardarYRenderizar() {
    localStorage.setItem('usuariosAdmin', JSON.stringify(usuarios));
    renderizarTabla();
  }

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
            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})">❌ Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  window.eliminarUsuario = function(index) {
    usuarios.splice(index, 1);
    guardarYRenderizar();
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

      // 1. Validar RUN Chileno
      if (!validarRutChileno(run)) {
        Swal.fire({
          icon: 'error', title: 'RUN Inválido',
          text: 'El RUN es incorrecto o no cumple el algoritmo Módulo 11 (Ej: 19011022K).',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar que Nombre y Apellidos solo contengan letras
      const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (!regexLetras.test(nombre) || nombre.length > 50 || !regexLetras.test(apellidos) || apellidos.length > 100) {
        Swal.fire({
          icon: 'error', title: 'Nombre o Apellidos Inválidos',
          text: 'Nombre y Apellidos solo pueden contener letras (sin números ni símbolos).',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar exacto un solo '@'
      const cantidadArrobas = (email.match(/@/g) || []).length;
      if (cantidadArrobas !== 1) {
        Swal.fire({
          icon: 'error', title: 'Correo Inválido',
          text: 'El correo electrónico debe contener exactamente un solo símbolo "@".',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Correo y Dominios
      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') || 
                           emailLower.endsWith('@duocuc.cl') ||
                           emailLower.endsWith('@profesor.duoc.cl') || 
                           emailLower.endsWith('@gmail.com');

      if (!correoValido || email.length > 100) {
        Swal.fire({
          icon: 'error', title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      if (tipo === '' || comuna === '' || direccion === '' || direccion.length > 300) {
        Swal.fire({
          icon: 'error', title: 'Campos Incompletos',
          text: 'Por favor, completa el Rol, Comuna y Dirección.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      usuarios.push({ run, nombre, apellidos, email: emailLower, tipo, comuna });
      guardarYRenderizar();

      Swal.fire({
        icon: 'success', title: '¡Usuario Creado!',
        text: `El usuario ${nombre} ${apellidos} fue registrado con el rol de ${tipo}.`,
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      });

      this.reset();
      comunaSelect.disabled = true;
    });
  }

  renderizarTabla();
});
