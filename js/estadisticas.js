console.log("estadisticas.js cargado");

function obtenerMovimientosEstadisticas() {
    // la app no usa localStorage: los movimientos viven en la variable
    // global `movimientos` (poblada desde Firestore), la misma que usa
    // respaldo.js para exportar. Si esa variable no existe o cambia de
    // nombre en tu datos.js/movimientos.js, avisame y lo ajusto.
    if (typeof movimientos !== "undefined" && Array.isArray(movimientos)) {
        return movimientos;
    }
    return [];
}

function obtenerTopMasUsados(categoriaBuscada) {
    const lista = obtenerMovimientosEstadisticas();
    const resumen = {};

    lista.forEach(function (mov) {
        if (mov.tipo !== "SALIDA") return;
        if (mov.categoria !== categoriaBuscada) return;

        const producto = mov.producto || "Sin nombre";
        const cantidad = Number(mov.cantidad) || 0;

        if (!resumen[producto]) {
            resumen[producto] = 0;
        }
        resumen[producto] += cantidad;
    });

    const resultado = Object.keys(resumen).map(function (producto) {
        return {
            producto: producto,
            cantidad: resumen[producto]
        };
    });

    resultado.sort(function (a, b) {
        return b.cantidad - a.cantidad;
    });

    return resultado;
}

function crearFilasEstadisticas(lista) {
    if (!lista.length) {
        return `
            <tr>
                <td colspan="3" class="sin-datos">No hay datos de uso.</td>
            </tr>
        `;
    }

    let html = "";
    lista.forEach(function (item, index) {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.producto}</td>
                <td>${item.cantidad}</td>
            </tr>
        `;
    });

    return html;
}

function renderizarEstadisticas() {

    const topReactivos = obtenerTopMasUsados("REACTIVOS");
    const topInsumos = obtenerTopMasUsados("INSUMOS");
    const topMateriales = obtenerTopMasUsados("MATERIALES");

    const tbodyReactivos = document.getElementById("tablaStatsReactivos");
    const tbodyInsumos = document.getElementById("tablaStatsInsumos");
    const tbodyMateriales = document.getElementById("tablaStatsMateriales");

    if (tbodyReactivos) {
        tbodyReactivos.innerHTML = crearFilasEstadisticas(topReactivos);
    }
    if (tbodyInsumos) {
        tbodyInsumos.innerHTML = crearFilasEstadisticas(topInsumos);
    }
    if (tbodyMateriales) {
        tbodyMateriales.innerHTML = crearFilasEstadisticas(topMateriales);
    }

    const topReactivo = document.getElementById("topReactivoNombre");
    const topInsumo = document.getElementById("topInsumoNombre");
    const topMaterial = document.getElementById("topMaterialNombre");

    if (topReactivo) {
        topReactivo.textContent = topReactivos.length
            ? `${topReactivos[0].producto} (${topReactivos[0].cantidad})`
            : "Sin datos";
    }
    if (topInsumo) {
        topInsumo.textContent = topInsumos.length
            ? `${topInsumos[0].producto} (${topInsumos[0].cantidad})`
            : "Sin datos";
    }
    if (topMaterial) {
        topMaterial.textContent = topMateriales.length
            ? `${topMateriales[0].producto} (${topMateriales[0].cantidad})`
            : "Sin datos";
    }
}

function abrirModalEstadisticas() {
    const modal = document.getElementById("modalEstadisticas");
    if (!modal) return;
    renderizarEstadisticas();
    modal.classList.add("abierto");
}

function cerrarModalEstadisticas() {
    const modal = document.getElementById("modalEstadisticas");
    if (!modal) return;
    modal.classList.remove("abierto");
}

window.abrirModalEstadisticas = abrirModalEstadisticas;
window.cerrarModalEstadisticas = cerrarModalEstadisticas;
window.renderizarEstadisticas = renderizarEstadisticas;
