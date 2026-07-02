const btnConfig = document.getElementById("btnConfig");
const menuConfig = document.getElementById("menuConfig");

btnConfig.addEventListener("click", function (e) {

    e.stopPropagation();

    menuConfig.classList.toggle("abierto");

});

document.addEventListener("click", function (e) {

    if (!menuConfig.contains(e.target) && e.target !== btnConfig) {

        menuConfig.classList.remove("abierto");

    }

});

document.getElementById("btnExportar").addEventListener("click", function () {

    menuConfig.classList.remove("abierto");

});

document.getElementById("btnImportar").addEventListener("click", function () {

    menuConfig.classList.remove("abierto");

});
