// Arreglo de Regiones y Comunas de Chile
const regionesYComunas = [
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
  const regionSelect = document.getElementById('regionSelect');
  const comunaSelect = document.getElementById('comunaSelect');

  // Cargar regiones en el select
  regionesYComunas.forEach((item, index) => {
    let opt = document.createElement('option');
    opt.value = index;
    opt.textContent = item.region;
    regionSelect.appendChild(opt);
  });

  // Cambiar comunas dinámicamente al seleccionar región
  regionSelect.addEventListener('change', (e) => {
    const idx = e.target.value;
    comunaSelect.innerHTML = '<option value="">-- Selecciona Comuna --</option>';
    
    if (idx !== "") {
      comunaSelect.disabled = false;
      regionesYComunas[idx].comunas.forEach(comuna => {
        let opt = document.createElement('option');
        opt.value = comuna;
        opt.textContent = comuna;
        comunaSelect.appendChild(opt);
      });
    } else {
      comunaSelect.disabled = true;
    }
  });

  // Envío y validación del formulario
  document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const run = document.getElementById('run').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const email = document.getElementById('email').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const referido = document.getElementById('referido').value.trim();

    // 1. Validar RUN (7 a 9 caracteres sin puntos ni guion)
    if (run.length < 7 || run.length > 9 || run.includes('.') || run.includes('-')) {
      Swal.fire({
        icon: 'error',
        title: 'RUN Inválido',
        text: 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion (ej: 19011022K).',
        background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
      });
      return;
    }

    // 2. Validar Correo Electrónico
    const correoValido = email.toLowerCase().endsWith('@duoc.cl') || 
                         email.toLowerCase().endsWith('@profesor.duoc.cl') || 
                         email.toLowerCase().endsWith('@gmail.com');
    if (!correoValido) {
      Swal.fire({
        icon: 'error',
        title: 'Correo no permitido',
        text: 'Solo se permiten correos con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.',
        background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
      });
      return;
    }

    // 3. Validar Mayoría de Edad (+18 años)
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    if (edad < 18) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Debes ser mayor de 18 años para registrarte en Level-Up Gamer.',
        background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
      });
      return;
    }

    // Mensaje de éxito con beneficios corporativos
    let mensajeExito = `¡Bienvenido(a) ${nombre} ${apellidos}! Tu cuenta ha sido creada.`;
    if (email.toLowerCase().includes('@duoc.cl')) {
      mensajeExito += "\n🎉 ¡Felicidades! Se ha aplicado tu descuento del 20% de por vida por ser alumno/docente Duoc UC.";
    }
    if (referido !== "") {
      mensajeExito += "\n🎮 Código de referido aceptado: ¡Has recibido Puntos LevelUp iniciales!";
    }

    Swal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: mensajeExito,
      background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
    });

    this.reset();
    document.getElementById('comunaSelect').disabled = true;
  });
});