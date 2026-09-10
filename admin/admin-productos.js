document.addEventListener('DOMContentLoaded', () => {
  // Arreglo inicial de productos
  let listaProductos = [
    { codigo: 'JM001', nombre: 'Catan', categoria: 'Juegos de Mesa', precio: 29990, stock: 10, stockCritico: 3 },
    { codigo: 'CO001', nombre: 'PlayStation 5', categoria: 'Consolas', precio: 549900, stock: 2, stockCritico: 3 },
    { codigo: 'SG001', nombre: 'Silla Gamer Secretlab Titan', categoria: 'Sillas Gamers', precio: 349990, stock: 5, stockCritico: 2 }
  ];

  function renderizarTabla() {
    const tbody = document.getElementById('tablaProductosAdmin');
    if (!tbody) return;
    tbody.innerHTML = '';

    listaProductos.forEach((prod, index) => {
      let alertaCritica = false;
      if (prod.stockCritico !== null && prod.stock <= prod.stockCritico) {
        alertaCritica = true;
      }

      tbody.innerHTML += `
        <tr>
          <td>${prod.codigo}</td>
          <td>${prod.nombre}</td>
          <td>${prod.categoria}</td>
          <td>$${Number(prod.precio).toLocaleString('es-CL')}</td>
          <td>${prod.stock}</td>
          <td>
            ${alertaCritica 
              ? '<span class="badge bg-warning text-dark">⚠️ Stock Crítico</span>' 
              : '<span class="badge bg-success">OK</span>'}
          </td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">Eliminar</button>
          </td>
        </tr>
      `;
    });
  }

  // Eliminar producto
  window.eliminarProducto = function(index) {
    listaProductos.splice(index, 1);
    renderizarTabla();
  };

  // Formulario Producto
  const prodForm = document.getElementById('productoForm');
  if (prodForm) {
    prodForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const codigo = document.getElementById('prodCodigo').value.trim();
      const nombre = document.getElementById('prodNombre').value.trim();
      const precio = parseFloat(document.getElementById('prodPrecio').value);
      const stock = parseInt(document.getElementById('prodStock').value);
      const stockCriticoRaw = document.getElementById('prodStockCritico').value.trim();
      const categoria = document.getElementById('prodCategoria').value;
      const descripcion = document.getElementById('prodDescripcion').value.trim();

      // 1. Validar Código (Requerido, Mínimo 3 caracteres)
      if (codigo.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Código Inválido',
          text: 'El código del producto debe tener al menos 3 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 2. Validar Nombre (Requerido, Máximo 100)
      if (nombre === '' || nombre.length > 100) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre Inválido',
          text: 'El nombre es obligatorio y no debe superar los 100 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 3. Validar Precio (Requerido, Min: 0)
      if (isNaN(precio) || precio < 0) {
        Swal.fire({
          icon: 'error',
          title: 'Precio Inválido',
          text: 'El precio es requerido y debe ser mayor o igual a 0.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 4. Validar Stock (Requerido, entero, Min: 0)
      if (isNaN(stock) || stock < 0) {
        Swal.fire({
          icon: 'error',
          title: 'Stock Inválido',
          text: 'El stock debe ser un número entero mayor o igual a 0.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 5. Stock Crítico (Opcional, entero >= 0)
      let stockCritico = null;
      if (stockCriticoRaw !== '') {
        stockCritico = parseInt(stockCriticoRaw);
        if (isNaN(stockCritico) || stockCritico < 0) {
          Swal.fire({
            icon: 'error',
            title: 'Stock Crítico Inválido',
            text: 'El stock crítico debe ser un número entero mayor o igual a 0.',
            background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
          });
          return;
        }
      }

      // 6. Validar Categoría
      if (categoria === '') {
        Swal.fire({
          icon: 'error',
          title: 'Categoría Requerida',
          text: 'Debes seleccionar una categoría para el producto.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // 7. Validar Descripción (Max 500)
      if (descripcion.length > 500) {
        Swal.fire({
          icon: 'error',
          title: 'Descripción muy larga',
          text: 'La descripción no puede superar los 500 caracteres.',
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
        return;
      }

      // Agregar a la lista
      listaProductos.push({
        codigo, nombre, categoria, precio, stock, stockCritico
      });

      // Alerta si ingresó un stock que ya está en nivel crítico
      if (stockCritico !== null && stock <= stockCritico) {
        Swal.fire({
          icon: 'warning',
          title: 'Producto Guardado con Stock Crítico',
          text: `Atención: El stock ingresado (${stock}) es menor o igual al stock crítico (${stockCritico}).`,
          background: '#111', color: '#fff', confirmButtonColor: '#1E90FF'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Producto Guardado!',
          text: `El producto ${nombre} fue agregado exitosamente al inventario.`,
          background: '#111', color: '#39FF14', confirmButtonColor: '#1E90FF'
        });
      }

      renderizarTabla();
      this.reset();
    });
  }

  renderizarTabla();
});
