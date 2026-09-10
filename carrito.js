
let carrito = JSON.parse(localStorage.getItem('carritoGamer')) || [];

function agregarAlCarrito(nombre, precio) {
    
    let productoExistente = carrito.find(item => item.nombre === nombre);
    if(productoExistente) {
        productoExistente.cantidad++; 
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 }); 
    }
    
    
    localStorage.setItem('carritoGamer', JSON.stringify(carrito));
    
    
    Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: `${nombre} se agregó a tu carrito.`,
        background: '#111',
        color: '#39FF14',
        confirmButtonColor: '#1E90FF',
        timer: 1500,
        showConfirmButton: false
    });
}

function renderizarCarrito() {
    let tabla = document.getElementById('tablaCarrito');
    let tfoot = document.getElementById('tfootCarrito');
    
   
    if(!tabla) return; 

    tabla.innerHTML = '';
    let total = 0;

    if(carrito.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">El carrito está vacío</td></tr>`;
        tfoot.innerHTML = '';
        return;
    }

    
    carrito.forEach((producto, index) => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;

      
        let formateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio);
        let subformateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(subtotal);

        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>${formateado}</td>
                <td>${subformateado}</td>
                <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">❌ Quitar</button></td>
            </tr>
        `;
    });

    let totalFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total);
    tfoot.innerHTML = `
        <tr class="fw-bold" style="font-size: 1.2rem;">
            <td colspan="3" class="text-end">Total a Pagar:</td>
            <td colspan="2" class="text-neon">${totalFormateado}</td>
        </tr>
    `;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1); 
    localStorage.setItem('carritoGamer', JSON.stringify(carrito));
    renderizarCarrito(); 
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carritoGamer', JSON.stringify(carrito));
    renderizarCarrito();
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', renderizarCarrito);