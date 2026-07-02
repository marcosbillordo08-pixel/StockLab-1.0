const btnConfig = document.getElementById("btnConfig");
const menuConfig = document.getElementById("menuConfig");

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
