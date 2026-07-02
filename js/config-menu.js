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

// IMPORTANTE: btnExportar y btnImportar ya están declarados como const
// en respaldo.js (que es el que maneja su lógica real de exportar/importar).
// Acá NO se vuelven a declarar con const/let — solo se buscan de nuevo
// con getElementById bajo otro nombre, para poder cerrar el menú al usarlos
// sin pisar la declaración de respaldo.js (eso era lo que rompía todo el archivo).

const btnExportarMenu = document.getElementById("btnExportar");
if (btnExportarMenu) {
    btnExportarMenu.addEventListener("click", function () {
        menuConfig.classList.remove("abierto");
    });
}

const btnImportarMenu = document.getElementById("btnImportar");
if (btnImportarMenu) {
    btnImportarMenu.addEventListener("click", function () {
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
