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
  if (regionSelect) {
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
  }

  // Envío y validación del formulario de registro
  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const run = document.getElementById('run').value.trim();
      const nombre = document.getElementById('nombre').value.trim();
      const apellidos = document.getElementById('apellidos').value.trim();
      const email = document.getElementById('email').value.trim();
      const fechaNacimiento = document.getElementById('fechaNacimiento').value;
      const referido = document.getElementById('referido').value.trim();
      const region = document.getElementById('regionSelect').value;
      const comuna = document.getElementById('comunaSelect').value;
      const direccion = document.getElementById('direccion').value.trim();

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

      // 2. Validar Nombre y Apellidos
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

      // 3. Validar Correo Electrónico (Solo @duoc.cl, @profesor.duoc.cl o @gmail.com)
      if (email === '' || email.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Correo Inválido',
          text: 'El correo electrónico es obligatorio y no puede superar los 100 caracteres.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') || 
                           emailLower.endsWith('@duocuc.cl') ||
                           emailLower.endsWith('@profesor.duoc.cl') || 
                           emailLower.endsWith('@gmail.com');
      if (!correoValido) {
        Swal.fire({
          icon: 'error',
          title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Mayoría de Edad (+18 años)
      if (!fechaNacimiento) {
        Swal.fire({
          icon: 'error',
          title: 'Fecha Requerida',
          text: 'Por favor, ingresa tu fecha de nacimiento.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

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
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. Validar Región y Comuna
      if (region === "" || comuna === "") {
        Swal.fire({
          icon: 'error',
          title: 'Ubicación Requerida',
          text: 'Debes seleccionar tu Región y Comuna.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 6. Validar Dirección
      if (direccion === '' || direccion.length > 300) {
        Swal.fire({
          icon: 'error',
          title: 'Dirección Inválida',
          text: 'La dirección es obligatoria y no puede superar los 300 caracteres.',
          background: '#111',
          color: '#fff',
          confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // Mensaje de éxito con beneficios de negocio
      let mensajeExito = `¡Bienvenido(a) ${nombre} ${apellidos}! Tu cuenta ha sido creada exitosamente.`;
      if (emailLower.includes('@duoc.cl') || emailLower.includes('@duocuc.cl') || emailLower.includes('@profesor.duoc.cl')) {
        mensajeExito += "\n🎉 ¡Felicidades! Se ha aplicado tu descuento del 20% de por vida por ser alumno/docente Duoc UC.";
      }
      if (referido !== "") {
        mensajeExito += "\n🎮 Código de referido aceptado: ¡Has recibido Puntos LevelUp iniciales!";
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
      comunaSelect.disabled = true;
    });
  }
});