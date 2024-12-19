
const productos = [
  {
      id: 1,
      imagen: "Images/mate.jpeg",
      nombre: "Mate de Madera",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 15000,
  },
  {
      id: 2,
      imagen: "Images/bombilla.jpeg",
      nombre: "Bombilla",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 5000,
  },
  {
      id: 3,
      imagen: "Images/cenicero.jpeg",
      nombre: "Cenicero",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 10000,
  },
  {
      id: 4,
      imagen: "Images/cuchillo.jpeg",
      nombre: "Cuchillo",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 15000,
  },
  {
      id: 5,
      imagen: "Images/cajate.jpg",
      nombre: "Caja de Té",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 15000,
  },
  {
      id: 6,
      imagen: "Images/azucarera.jpg",
      nombre: "Azucarera de Madera",
      descripcion: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      precio: 8000,
  }
];


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function renderizarProductos() {
  const contenedor = document.getElementById("productos-container");

  
  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "card", "mb-4");

    card.innerHTML = `
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h5 class="card-nombre">${producto.nombre}</h5>
            <p class="card-descripcion">${producto.descripcion}</p>
            <p class="card-precio">$${producto.precio.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="añadirAlCarrito(${producto.id})">Lo quiero!</button>
        </div>
    `;

    contenedor.appendChild(card);
});
}


function añadirAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(p => p.id === id);

  if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1;
  } else {
      carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
  guardarCarrito();
}


function actualizarCarrito() {
  const cartCount = document.getElementById("cart-count");
  const totalProductos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  cartCount.textContent = totalProductos;
}


window.addEventListener("storage", function (e) {
  if (e.key === "carrito") {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    actualizarCarrito();
    mostrarCarrito();
  }
});



function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}



function mostrarCarrito() {
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotal = document.getElementById("cart-total");
  cartTableBody.innerHTML = "";

  let total = 0;

  carrito.forEach(producto => {
      const subtotal = producto.cantidad * producto.precio;
      total += subtotal;

      const fila = document.createElement("tr");
      fila.innerHTML = `
          <td>
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; margin-right: 10px;">
            ${producto.nombre}
        </td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="modificarCantidad(${producto.id}, -1)">-</button>
              ${producto.cantidad}
              <button class="btn btn-sm btn-success" onclick="modificarCantidad(${producto.id}, 1)">+</button>
          </td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
          <td>
              <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
          </td>
      `;
      cartTableBody.appendChild(fila);
  });

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}


function modificarCantidad(id, cantidad) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
      producto.cantidad += cantidad;
      if (producto.cantidad <= 0) {
          eliminarDelCarrito(id);
      }
      actualizarCarrito();
      guardarCarrito();
      mostrarCarrito();
  }
}


function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
  guardarCarrito();
  mostrarCarrito();
}


document.getElementById("cart-icon").addEventListener("click", () => {
  mostrarCarrito();
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  cartModal.show();
});

function VaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  guardarCarrito(); 
  mostrarCarrito();
}

document.getElementById("vaciar-carrito").addEventListener("click", () => {
  VaciarCarrito();
});


document.getElementById("comprar-carrito").addEventListener("click", () => {
  
  if (carrito.length === 0) {
    const emptyCartToast = document.getElementById('emptyCartToast');
    const toast = new bootstrap.Toast(emptyCartToast);
    toast.show();
  } else {
    const thankYouToast = document.getElementById('thankYouToast');
    const toast = new bootstrap.Toast(thankYouToast);
    toast.show();
    VaciarCarrito();
    
  }
});

actualizarCarrito();
renderizarProductos();