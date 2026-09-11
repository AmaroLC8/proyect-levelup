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

// Algoritmo Módulo 11 para verificar si el RUN chileno es verdadero
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
  const regionSelect = document.getElementById('regionSelect');
  const comunaSelect = document.getElementById('comunaSelect');

  if (regionSelect) {
    regionesYComunas.forEach((item, index) => {
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

  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const run = document.getElementById('run').value.trim();
      const nombre = document.getElementById('nombre').value.trim();
      const apellidos = document.getElementById('apellidos').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
      const fechaNacimiento = document.getElementById('fechaNacimiento').value;
      const referido = document.getElementById('referido').value.trim();
      const region = document.getElementById('regionSelect').value;
      const comuna = document.getElementById('comunaSelect').value;
      const direccion = document.getElementById('direccion').value.trim();

      // 1. Validar RUN Chileno con Algoritmo Módulo 11
      if (!validarRutChileno(run)) {
        Swal.fire({
          icon: 'error',
          title: 'RUN Inválido',
          text: 'El RUN ingresado no existe o es matemáticamente incorrecto (Ej: 19011022K).',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar que Nombre y Apellidos contengan SOLO LETRAS y espacios
      const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!regexLetras.test(nombre) || nombre.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre Inválido',
          text: 'El nombre es obligatorio, solo debe contener letras (sin números ni símbolos) y máximo 50 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      if (!regexLetras.test(apellidos) || apellidos.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Apellidos Inválidos',
          text: 'Los apellidos son obligatorios, solo deben contener letras (sin números ni símbolos) y máximo 100 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar exacto UN solo '@' en el correo
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

      // 4. Validar Dominios Permitidos
      const emailLower = email.toLowerCase();
      const correoValido = emailLower.endsWith('@duoc.cl') || 
                           emailLower.endsWith('@duocuc.cl') ||
                           emailLower.endsWith('@profesor.duoc.cl') || 
                           emailLower.endsWith('@gmail.com');
      if (!correoValido || email.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Correo No Permitido',
          text: 'Solo se permiten correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. Validar Contraseña
      if (password.length < 4 || password.length > 10) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Inválida',
          text: 'La contraseña debe tener entre 4 y 10 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas no coinciden',
          text: 'La confirmación de la contraseña debe ser exactamente igual a la contraseña ingresada.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 6. Validar Mayoría de Edad (+18 años)
      if (!fechaNacimiento) {
        Swal.fire({
          icon: 'error',
          title: 'Fecha Requerida',
          text: 'Por favor, ingresa tu fecha de nacimiento.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
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
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 7. Validar Ubicación y Dirección
      if (region === "" || comuna === "") {
        Swal.fire({
          icon: 'error',
          title: 'Ubicación Requerida',
          text: 'Debes seleccionar tu Región y Comuna.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      if (direccion === '' || direccion.length > 300) {
        Swal.fire({
          icon: 'error',
          title: 'Dirección Inválida',
          text: 'La dirección es obligatoria y no puede superar los 300 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 8. GUARDAR USUARIOS Y CONTRASEÑA EN LOCALSTORAGE
      let usuariosActuales = JSON.parse(localStorage.getItem('usuariosAdmin')) || [
        { run: '19011022K', nombre: 'Gonzalo', apellidos: 'Pérez', email: 'admin@duoc.cl', password: 'admin', tipo: 'Administrador', comuna: 'Santiago' }
      ];

      const correoExiste = usuariosActuales.some(usr => usr.email.toLowerCase() === emailLower);
      if (correoExiste) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario Ya Registrado',
          text: 'Este correo electrónico ya tiene una cuenta activa. Intenta iniciar sesión.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      const comunaNombre = comunaSelect.options[comunaSelect.selectedIndex] ? comunaSelect.options[comunaSelect.selectedIndex].text : 'Sin especificar';
      
      const nuevoUsuario = { 
        run, 
        nombre, 
        apellidos, 
        email: emailLower, 
        password, 
        tipo: 'Cliente', 
        comuna: comunaNombre 
      };

      usuariosActuales.push(nuevoUsuario);
      localStorage.setItem('usuariosAdmin', JSON.stringify(usuariosActuales));

      let mensajeExito = `¡Bienvenido(a) ${nombre} ${apellidos}! Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.`;
      if (emailLower.includes('@duoc.cl') || emailLower.includes('@duocuc.cl') || emailLower.includes('@profesor.duoc.cl')) {
        mensajeExito += "\n🎉 ¡Felicidades! Se ha aplicado tu descuento del 20% de por vida por ser alumno/docente Duoc UC.";
      }

      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: mensajeExito,
        background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
      }).then(() => {
        window.location.href = 'login.html';
      });

      this.reset();
      comunaSelect.disabled = true;
    });
  }
});
