function calcularStock() {
    console.log("Calculando stock...");

    const stock = {};

    movimientos.forEach(function(movimiento) {

    if (!(movimiento.producto in stock)) {

        stock[movimiento.producto] = {

           categoria: movimiento.categoria,

           marca: movimiento.marca,

           presentacion: movimiento.presentacion,

           cantidad: 0,

           r1: 0,

           r2: 0

        };

    }

    if (movimiento.tipo === "ENTRADA") {

        stock[movimiento.producto].cantidad += movimiento.cantidad;

        stock[movimiento.producto].r1 += movimiento.r1 * movimiento.cantidad;

        stock[movimiento.producto].r2 += movimiento.r2 * movimiento.cantidad;

    }
    else {

        if (movimiento.componenteSalida === "R1") {

            stock[movimiento.producto].r1 -= movimiento.cantidad;

        }

        if (movimiento.componenteSalida === "R2") {

            stock[movimiento.producto].r2 -= movimiento.cantidad;

        }

    }
});

console.log(stock);

const categoriaSeleccionada =
    document.getElementById("categoriaStock").value;

const textoBusqueda = document
    .getElementById("buscarStock")
    .value
    .toLowerCase();

const tablaStock = document.querySelector("#tablaStock tbody");

tablaStock.innerHTML = "";

for (const producto in stock) {

    if (stock[producto].categoria !== categoriaSeleccionada) {
        continue;
    }

    if (!producto.toLowerCase().includes(textoBusqueda)) {
        continue;
    }

    const reactivo = reactivos.find(function(r){

        return r.nombre === producto;

    });

    let estado = "🟢";

    if (reactivo && stock[producto].cantidad <= reactivo.minimo){

        estado = "🔴";

    }

    const mostrarR1 = stock[producto].r1 === 0 ? "-" : stock[producto].r1;
    const mostrarR2 = stock[producto].r2 === 0 ? "-" : stock[producto].r2;

    const fila = document.createElement("tr");

    fila.innerHTML = `
       <td>${producto}</td>
       <td>${stock[producto].marca}</td>
       <td>${stock[producto].presentacion}</td>
       <td>${stock[producto].cantidad}</td>
       <td>${mostrarR1}</td>
       <td>${mostrarR2}</td>
       <td>${estado}</td>
    `;

    tablaStock.appendChild(fila);

}

}


const categoriaStock = document.getElementById("categoriaStock");

categoriaStock.addEventListener("change", function () {

    calcularStock();

});

