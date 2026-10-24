let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarios = [];

// Simulación de Stock
let stock = JSON.parse(localStorage.getItem("stock")) || {
    Blusa: 15,
    Vestido: 14,
    Sueter: 13,
    Polo: 16,
    Top: 15,
    Chaqueta: 2
};

function guardarStock() {
    localStorage.setItem("stock", JSON.stringify(stock));
}

// Creación de Funciones

function guardar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregar(nombre, precio, imagen) {

    if (stock[nombre] <= 0) {
        alert("Producto sin stock disponible");
        return;
    }

    carrito.push({nombre, precio, imagen});
    stock[nombre]--;

    guardar();
    guardarStock();
    actualizarContador();
    mostrarStock();
}

function actualizarContador() {
    let contador = document.getElementById("contador");
    if (contador) contador.textContent = carrito.length;
}

function mostrarCarrito() {
    let lista = document.getElementById("lista");
    let total = 0;

    if (!lista) return;

    lista.innerHTML = "";

    carrito.forEach((item, index) => {

        let li = document.createElement("li");

        let stockDisponible = stock[item.nombre];

        li.innerHTML = `
            <img src="${item.imagen}" style="width:60px">
            <span>
                ${item.nombre} - S/${item.precio.toFixed(2)}<br>
                Stock disponible: ${stockDisponible}
                ${stockDisponible <= 2 && stockDisponible > 0 ? `<br><small>¡Últimas unidades!</small>` : ""}
                ${stockDisponible === 0 ? `<br><small>Producto agotado</small>` : ""}
            </span>
            <button onclick="eliminar(${index})">X</button>
        `;

        lista.appendChild(li);
        total += item.precio;
    });

    //descuento

    let subtotal = total;
    let igv = subtotal / 1.18 * 0.18;
    let descuento = 0;

    if (subtotal > 100) {
        descuento = subtotal * 0.15;
    }

    let totalPagar = subtotal - descuento;

    let totalElemento = document.getElementById("total");

    if (totalElemento) {
        totalElemento.innerHTML = `
            Subtotal: S/ ${subtotal.toFixed(2)} <br>
            IGV incluido (18%): S/ ${igv.toFixed(2)} <br>
            Descuento: S/ ${descuento.toFixed(2)} <br>
            <strong>Total a pagar: S/ ${totalPagar.toFixed(2)}</strong>
        `;
    }

}


function eliminar(index) {
    let producto = carrito[index];

    stock[producto.nombre]++;
    carrito.splice(index, 1);

    guardar();
    guardarStock();
    mostrarCarrito();
    actualizarContador();
    mostrarStock();
}

function finalizarCompra() {
    let total = carrito.reduce((acc, item) => acc + item.precio, 0);

    if (total > 100) {
        total *= 0.9;
    }

    alert("Compra realizada. Total: $ " + total.toFixed(2));

    carrito = [];
    guardar();
    mostrarCarrito();
    actualizarContador();
}

actualizarContador();

function mostrarStock() {
    Object.keys(stock).forEach(producto => {
        let elemento = document.getElementById(`stock-${producto}`);
        if (elemento) {
            elemento.textContent = stock[producto];
        }
    });
}

mostrarCarrito();
mostrarStock();

const form = document.getElementById("formRegistro");

if (form) {
    form.addEventListener("submit", function(e){
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let correo = document.getElementById("correo").value;
        let password = document.getElementById("password").value;

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{9}$/;

        if(!regexCorreo.test(correo)){
            alert("Correo inválido");
            return;
        }

        if(!regexPassword.test(password)){
            alert("La contraseña debe tener exactamente 9 caracteres alfanuméricos, una mayúscula y un número");
            return;
        }

        let existe = usuarios.some(user => user.correo === correo);
        if(existe){
            alert("Este correo ya está registrado");
            return;
        }

        usuarios.push({nombre, correo, password});
        alert("Usuario registrado correctamente");

        mostrarUsuarios();
        form.reset();
    });
}

function mostrarUsuarios(){
    let contenedor = document.getElementById("listaUsuarios");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (usuarios.length === 0) {
        contenedor.innerHTML = `
            <tr>
                <td colspan="3" class="text-center" style="color:#555; padding:20px;">
                    Aún no hay usuarias registradas
                </td>
            </tr>`;
        return;
    }

    usuarios.forEach((user, index) => {
        contenedor.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
            </tr>`;
    });
}
