function mostrarMovimiento(movimiento) {
    const tabla = document.querySelector("#tablaMovimientos tbody");
    const fila = document.createElement("tr");
    const mostrarR1 = movimiento.r1 === 0 ? "-" : movimiento.r1;
    const mostrarR2 = movimiento.r2 === 0 ? "-" : movimiento.r2;
    fila.innerHTML = `
        <td>${movimiento.id}</td>
        <td>${movimiento.fecha}</td>
        <td>${movimiento.tipo}</td>
        <td>${movimiento.categoria}</td>
        <td>${movimiento.producto}</td>
        <td>${movimiento.marca}</td>
        <td>${movimiento.codigo}</td>
        <td>${movimiento.codigoBarras}</td>
        <td>${movimiento.presentacion}</td>
        <td>${movimiento.tipoReactivo}</td>
        <td>${mostrarR1}</td>
        <td>${mostrarR2}</td>
        <td>${movimiento.lote}</td>
        <td>${movimiento.vencimiento}</td>
        <td>${movimiento.cantidad}</td>
        <td>
            <button class="btnEliminar" data-id="${movimiento.id}">🗑</button>
        </td>
    `;
    tabla.appendChild(fila);
    const botonEliminar = fila.querySelector(".btnEliminar");
    botonEliminar.addEventListener("click", function () {
        eliminarMovimiento(movimiento.id);
    });
}
function limpiarTabla() {
    const tabla = document.querySelector("#tablaMovimientos tbody");
    tabla.innerHTML = "";
}
