console.log("StockLab iniciado");

// Obtener el select de productos
const listaProductos = document.getElementById("producto");

// Llenar el select con los reactivos
reactivos.forEach(function(reactivo){

    const opcion = document.createElement("option");

    opcion.value = reactivo.nombre;
    opcion.textContent = reactivo.nombre;

    listaProductos.appendChild(opcion);

});

const listaMarcas = document.getElementById("marca");

marcas.forEach(function(marca){

    const opcion = document.createElement("option");

    opcion.value = marca;
    opcion.textContent = marca;

    listaMarcas.appendChild(opcion);

});

const comboCategoria = document.getElementById("categoria");

comboCategoria.addEventListener("change", actualizarProductos);

actualizarCodigoReferencia();

function actualizarProductos() {

    const categoria = comboCategoria.value;

    const tipoReactivo = document.getElementById("tipoReactivo");
    const lblTipoReactivo = document.getElementById("lblTipoReactivo");
    const componentes = document.getElementById("componentesReactivo");

    if (categoria === "REACTIVOS") {

        tipoReactivo.style.display = "block";
        lblTipoReactivo.style.display = "block";
        componentes.style.display = "block";

    } else {

        tipoReactivo.style.display = "none";
        lblTipoReactivo.style.display = "none";
        componentes.style.display = "none";

    }

    listaProductos.innerHTML = "";

    categorias[categoria].forEach(function(producto) {

    const opcion = document.createElement("option");

        if (categoria === "REACTIVOS") {

            opcion.value = producto.nombre;
            opcion.textContent = producto.nombre;

        } else {

            opcion.value = producto;
            opcion.textContent = producto;

        }

        listaProductos.appendChild(opcion);

    });


}


const pestañas = document.querySelectorAll(".tab");

const panelMovimientos = document.getElementById("movimientos");
const panelStock = document.getElementById("stock");
const panelVencimientos = document.getElementById("vencimientos");

pestañas[0].addEventListener("click", function () {

    panelMovimientos.style.display = "flex";
    panelStock.style.display = "none";

});

pestañas[1].addEventListener("click", function () {

    panelMovimientos.style.display = "none";
    panelStock.style.display = "block";
    panelVencimientos.style.display = "none";

});

pestañas[2].addEventListener("click", function () {

    panelMovimientos.style.display = "none";
    panelStock.style.display = "none";
    panelVencimientos.style.display = "block";
    
    calcularVencimientos();

});

const buscarStock = document.getElementById("buscarStock");

buscarStock.addEventListener("input", function () {

    calcularStock();

});

const buscarVencimiento = document.getElementById("buscarVencimiento");

buscarVencimiento.addEventListener("input", function () {

    calcularVencimientos();

});

function actualizarCodigoReferencia() {

    const producto = document.getElementById("producto").value;
    const marca = document.getElementById("marca").value;

    console.log("Producto:", producto);
    console.log("Marca:", marca);
    console.log("Código encontrado:", codigosReferencia[marca]?.[producto]);

    const campoCodigo = document.getElementById("codigoReferencia");

    if (codigosReferencia[marca] &&
        codigosReferencia[marca][producto]) {

        campoCodigo.value = codigosReferencia[marca][producto];

    } else {

        campoCodigo.value = "";

    }

}

function limpiarCodigoBarras(codigo){

    if (codigo.startsWith("01")){

        codigo = codigo.substring(2, 15);

    }

    return codigo;

}

function buscarProductoPorCodigo(codigo){

    const movimiento = movimientos.find(function(m){

        return m.codigoBarras === codigo;

    });

    const mensaje = document.getElementById("mensajeCodigo");

    if (!movimiento){

        mensaje.textContent = "🔴 Producto no registrado. Complete los datos y agréguelo.";

        mensaje.style.color = "#ff6666";

        return;

    }

    document.getElementById("producto").value = movimiento.producto;

    document.getElementById("marca").value = movimiento.marca;

    actualizarCodigoReferencia();

    document.getElementById("presentacion").value = movimiento.presentacion;

    document.getElementById("tipoReactivo").value = movimiento.tipoReactivo;

    document.getElementById("cantidadR1").value = movimiento.r1;

    document.getElementById("cantidadR2").value = movimiento.r2;

    actualizarTipoReactivo();

    mensaje.textContent = "🟢 Producto encontrado.";

    mensaje.style.color = "#6dd56d";

    document.getElementById("lote").focus();

}

document.getElementById("producto").addEventListener("change", actualizarCodigoReferencia);

document.getElementById("marca").addEventListener("change", actualizarCodigoReferencia);

document.getElementById("codigoBarras").addEventListener("change", function(){

    let codigo = this.value;

    codigo = limpiarCodigoBarras(codigo);

    this.value = codigo;

    buscarProductoPorCodigo(codigo);

});
    
actualizarCodigoReferencia();

actualizarProductos();

document.getElementById("lote").addEventListener("input", function(){

    this.classList.remove("error");

});

function actualizarDashboard() {

    // Tarjeta de movimientos
    document.getElementById("cardMovimientos").textContent = movimientos.length;

    // Tarjeta de productos con stock
    const productosConStock = {};

    movimientos.forEach(function(movimiento){

        if (!(movimiento.producto in productosConStock)) {

            productosConStock[movimiento.producto] = 0;

        }

        if (movimiento.tipo === "ENTRADA") {

            productosConStock[movimiento.producto] += movimiento.cantidad;

        } else {

            productosConStock[movimiento.producto] -= movimiento.cantidad;

        }

    });

    let total = 0;

    for (const producto in productosConStock){

        if (productosConStock[producto] > 0){

            total++;

        }

    }

    document.getElementById("cardStock").textContent = total;

    let criticos = 0;
 
    reactivos.forEach(function(reactivo){

      // Si el producto nunca tuvo movimientos, no lo contamos
        if (!(reactivo.nombre in productosConStock)) {

           return;

        }

        const stock = productosConStock[reactivo.nombre];

        if (stock <= reactivo.minimo){

            criticos++;

        }

    });

    document.getElementById("cardCritico").textContent = criticos;

}

const comboTipoReactivo = document.getElementById("tipoReactivo");

const comboTipo = document.getElementById("tipo");

comboTipo.addEventListener("change", actualizarComponenteSalida);

function actualizarComponenteSalida(){

    const panelSalida = document.getElementById("panelComponenteSalida");

    const categoria = document.getElementById("categoria").value;

    if (comboTipo.value === "SALIDA" && categoria === "REACTIVOS"){

        panelSalida.style.display = "block";

    } else {

        panelSalida.style.display = "none";

    }

}

comboTipoReactivo.addEventListener("change", actualizarTipoReactivo);

function actualizarTipoReactivo(){

    const lblR1 = document.getElementById("lblR1");
    const cantidadR1 = document.getElementById("cantidadR1");

    const lblR2 = document.getElementById("lblR2");
    const cantidadR2 = document.getElementById("cantidadR2");

    if (comboTipoReactivo.value === "A"){

        lblR1.style.display = "block";
        cantidadR1.style.display = "block";

        lblR2.style.display = "none";
        cantidadR2.style.display = "none";

    }

    else if (comboTipoReactivo.value === "B"){

        lblR1.style.display = "none";
        cantidadR1.style.display = "none";

        lblR2.style.display = "block";
        cantidadR2.style.display = "block";

    }

    else{

        lblR1.style.display = "block";
        cantidadR1.style.display = "block";

        lblR2.style.display = "block";
        cantidadR2.style.display = "block";

    }

}

actualizarTipoReactivo();

actualizarComponenteSalida();
