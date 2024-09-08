const productList = document.getElementById('productList');
const addProductForm = document.getElementById('addProductForm');
const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModal = document.getElementsByClassName('close')[0];
const modalTitle = document.querySelector('.modal-content h2'); // Referencia al título del modal
const apiBaseUrl = 'http://localhost:3000/api';

let productoId = null; // Usaremos esto para la modificación

// Función para abrir el modal para agregar un producto
openModalBtn.onclick = function() {
    modalTitle.textContent = 'Agregar Producto';  // Cambiar el título a "Agregar Producto"
    modal.style.display = 'block';
}

// Función para cerrar el modal
closeModal.onclick = function() {
    modal.style.display = 'none';
    limpiarFormulario(); // Limpiar los campos cuando se cierra
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        limpiarFormulario();
    }
}

// Limpiar los campos del formulario
function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('stock').value = '';
    productoId = null; // Limpiar la referencia de ID
}

// Función para agregar o modificar un producto
addProductForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    const producto = {
        nombre,
        descripcion,
        precio,
        stock
    };

    try {
        let response;
        if (productoId) {
            // Modificar producto
            response = await fetch(`${apiBaseUrl}/productos/${productoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });
        } else {
            // Agregar producto
            response = await fetch(`${apiBaseUrl}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });
        }

        if (response.ok) {
            alert(productoId ? 'Producto modificado' : 'Producto agregado');
            cargarProductos();
            modal.style.display = 'none'; // Cerrar el modal
            limpiarFormulario();
        }
    } catch (error) {
        console.error('Error al procesar el producto:', error);
    }
});

// Función para cargar todos los productos
async function cargarProductos() {
    productList.innerHTML = '';

    try {
        const response = await fetch(`${apiBaseUrl}/productos`);
        const productos = await response.json();

        productos.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `${producto.nombre} - ${producto.descripcion} - $${producto.precio} 
                            <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
                            <button onclick="abrirModalModificar('${producto._id}', '${producto.nombre}', '${producto.descripcion}', '${producto.precio}', '${producto.stock}')">Modificar</button>`;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para abrir el modal para modificar producto
function abrirModalModificar(id, nombre, descripcion, precio, stock) {
    modalTitle.textContent = 'Modificar Producto';  // Cambiar el título a "Modificar Producto"
    productoId = id; // Guardar el ID del producto a modificar
    document.getElementById('nombre').value = nombre;
    document.getElementById('descripcion').value = descripcion;
    document.getElementById('precio').value = precio;
    document.getElementById('stock').value = stock;

    modal.style.display = 'block';

    // Establecer el foco en el primer campo del formulario
    setTimeout(() => {
        document.getElementById('nombre').focus();
    }, 100);
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/productos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Producto eliminado');
            cargarProductos();
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

// Cargar los productos al inicio
cargarProductos();
