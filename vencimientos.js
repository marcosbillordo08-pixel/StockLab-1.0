function calcularVencimientos() {

    console.log(movimientos);

    const tabla = document.querySelector("#tablaVencimientos tbody");

    const textoBuscar = document
        .getElementById("buscarVencimiento")
        .value
        .toLowerCase();

    tabla.innerHTML = "";

    const movimientosOrdenados = [...movimientos];

    movimientosOrdenados.sort(function(a, b){

        return new Date(a.vencimiento) - new Date(b.vencimiento);

    });

    movimientosOrdenados.forEach(function(movimiento){

        console.log(movimientos);

        if (!movimiento.producto.toLowerCase().includes(textoBuscar)) {

            return;

        }

        if (movimiento.categoria !== "REACTIVOS") return;

        if (movimiento.tipo !== "ENTRADA") return;

        const hoy = new Date();

        const fechaVencimiento = new Date(movimiento.vencimiento);

        const diferencia = fechaVencimiento - hoy;

        const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        
        const fila = document.createElement("tr");

        console.log("ENTRO");

        let estado = "";

        if (diasRestantes <= 30) {

            estado = "🔴";

        } else if (diasRestantes <= 60) {

            estado = "🟡";

        } else {

            estado = "🟢";

        }

        fila.innerHTML = `
            <td>${movimiento.producto}</td>
            <td>${movimiento.marca}</td>
            <td>${movimiento.lote}</td>
            <td>${movimiento.vencimiento}</td>
            <td>${diasRestantes}</td>
            <td>${estado}</td>
        `;

        const celdas = fila.querySelectorAll("td");

        tabla.appendChild(fila);

    });

}

function formatearFecha(fecha){

    const partes = fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}