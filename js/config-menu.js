const btnConfig = document.getElementById("btnConfig");
const menuConfig = document.getElementById("menuConfig");

const btnEstadisticas = document.getElementById("btnEstadisticas");
const btnCerrarModalEstadisticas = document.getElementById("cerrarModalEstadisticas");
const modalEstadisticas = document.getElementById("modalEstadisticas");

if (btnConfig && menuConfig) {
    btnConfig.addEventListener("click", function (e) {
        e.stopPropagation();
        menuConfig.classList.toggle("abierto");
    });

    document.addEventListener("click", function (e) {
        if (!menuConfig.contains(e.target) && e.target !== btnConfig) {
            menuConfig.classList.remove("abierto");
        }
    });
}

const btnExportar = document.getElementById("btnExportar");
if (btnExportar) {
    btnExportar.addEventListener("click", function () {
        menuConfig.classList.remove("abierto");
    });
}

const btnImportar = document.getElementById("btnImportar");
if (btnImportar) {
    btnImportar.addEventListener("click", function () {
        menuConfig.classList.remove("abierto");
    });
}

if (btnEstadisticas) {
    btnEstadisticas.addEventListener("click", function () {
        menuConfig.classList.remove("abierto");

        if (typeof abrirModalEstadisticas === "function") {
            abrirModalEstadisticas();
        }
    });
}

if (btnCerrarModalEstadisticas) {
    btnCerrarModalEstadisticas.addEventListener("click", function () {
        if (typeof cerrarModalEstadisticas === "function") {
            cerrarModalEstadisticas();
        }
    });
}

if (modalEstadisticas) {
    modalEstadisticas.addEventListener("click", function (e) {
        if (e.target === modalEstadisticas) {
            if (typeof cerrarModalEstadisticas === "function") {
                cerrarModalEstadisticas();
            }
        }
    });
}
