console.log("Movimientos cargados");

const boton = document.getElementById("btnAgregar");

boton.addEventListener("click", agregarMovimiento);

async function agregarMovimiento() {

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

        movimientos.forEach(function (movimiento) {

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

    boton.disabled = true;

    try {

        // Se guarda en Firestore. No hace falta tocar el DOM ni el array
        // "movimientos" acá: el listener de más abajo (onSnapshot) se entera
        // solo del cambio y redibuja todo, en este dispositivo y en cualquier
        // otro que tenga la página abierta.

        await db.collection("movimientos").doc(String(movimiento.id)).set(movimiento);

    } catch (error) {

        console.error(error);

        alert("No se pudo guardar el movimiento: " + error.message);

    } finally {

        boton.disabled = false;

    }

}

async function eliminarMovimiento(id) {

    try {

        await db.collection("movimientos").doc(String(id)).delete();

    } catch (error) {

        console.error(error);

        alert("No se pudo eliminar el movimiento: " + error.message);

    }

}

// ============================================================
// Sincronización en tiempo real con Firestore
// ============================================================

function renderizarTodo() {

    limpiarTabla();

    movimientos.forEach(function (movimiento) {

        mostrarMovimiento(movimiento);

    });

    actualizarDashboard();

    calcularStock();

    calcularVencimientos();

}

db.collection("movimientos")
    .orderBy("id", "asc")
    .onSnapshot(function (snapshot) {

        movimientos.length = 0;

        snapshot.forEach(function (docSnap) {

            movimientos.push(docSnap.data());

        });

        renderizarTodo();

    }, function (error) {

        // Es normal ver un error acá una única vez si el listener arranca
        // antes de que termine de resolverse el login; en cuanto el usuario
        // queda autenticado y aprobado, Firestore reintenta solo.
        console.error("Error escuchando movimientos:", error);

    });
