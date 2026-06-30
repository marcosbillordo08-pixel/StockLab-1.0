console.log("Movimientos cargados");

const boton = document.getElementById("btnAgregar");

boton.addEventListener("click", agregarMovimiento);

function agregarMovimiento() {
    
    const componenteSalida = document.getElementById("componenteSalida").value;
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;
    const producto = document.getElementById("producto").value;
    const marca = document.getElementById("marca").value;
    const codigo = document.getElementById("codigoReferencia").value;
    const codigoBarras = document.getElementById("codigoBarras").value;
    const presentacion = document.getElementById("presentacion").value;
    const tipoReactivo = document.getElementById("tipoReactivo").value;
    const r1 = Number(document.getElementById("cantidadR1").value);
    const r2 = Number(document.getElementById("cantidadR2").value);
    const cantidad = document.getElementById("cantidad").value;
    const lote = document.getElementById("lote").value;
    const vencimiento = document.getElementById("vencimiento").value;

    // Validaciones

    if (producto === "") {

        alert("Debe seleccionar un producto.");

        return;

    }

    if (codigo === "") {

        alert("No existe un código de referencia para este producto y marca.");

        return;

    }

    if (categoria === "REACTIVOS" && lote.trim() === "") {

        const campoLote = document.getElementById("lote");

        campoLote.classList.add("error");

        campoLote.focus();

        return;

    }

    if (categoria === "REACTIVOS" && vencimiento === "") {

        alert("Debe ingresar la fecha de vencimiento.");

        return;

    }

    if (cantidad <= 0) {

        alert("La cantidad debe ser mayor que cero.");

        return;

    }

    if (tipo === "SALIDA") {

        let stockActual = 0;

        movimientos.forEach(function(movimiento) {

            if (movimiento.producto === producto) {

                if (movimiento.tipo === "ENTRADA") {
                    stockActual += movimiento.cantidad;
                } else {
                    stockActual -= movimiento.cantidad;
                }

            }

        });

        if (cantidad > stockActual) {

            alert("No hay stock suficiente para realizar la salida.");

            return;

        }

    }

    const movimiento = {

    id: Date.now(),

    fecha: new Date().toLocaleDateString(),

    tipo: tipo,

    categoria: categoria,

    producto: producto,

    marca: marca,

    codigo: codigo,

    codigoBarras: codigoBarras,

    presentacion: presentacion,

    tipoReactivo: tipoReactivo,

    r1: r1,

    r2: r2,

    componenteSalida: componenteSalida,

    lote: lote,

    vencimiento: vencimiento,

    cantidad: Number(cantidad)

};


movimientos.push(movimiento);

console.log(movimientos);

    mostrarMovimiento(movimiento);    

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    actualizarDashboard();

    calcularStock();

}

window.addEventListener("load", cargarMovimientos);

function cargarMovimientos() {

    const datosGuardados = localStorage.getItem("movimientos");

    if (!datosGuardados) return;

    const lista = JSON.parse(datosGuardados);

    console.log(lista);

    lista.forEach(function(movimiento){

    movimientos.push(movimiento);

    mostrarMovimiento(movimiento);

});

calcularStock();

actualizarDashboard();

}

function eliminarMovimiento(id) {

    const indice = movimientos.findIndex(function(movimiento) {
        return movimiento.id === id;
    });

    console.log(indice);

    movimientos.splice(indice, 1);

    console.log(movimientos);

    localStorage.setItem("movimientos", JSON.stringify(movimientos));

    actualizarDashboard();

    limpiarTabla();

    movimientos.forEach(function(movimiento){

    mostrarMovimiento(movimiento);

});

}
