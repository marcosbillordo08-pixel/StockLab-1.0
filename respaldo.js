const btnExportar = document.getElementById("btnExportar");

btnExportar.addEventListener("click", exportarRespaldo);

function exportarRespaldo() {

    const datos = {

        version: "1.0",

        fecha: new Date().toLocaleString(),

        movimientos: movimientos

    };

    const json = JSON.stringify(datos, null, 4);

    const blob = new Blob([json], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const enlace = document.createElement("a");

    const ahora = new Date();

    const año = ahora.getFullYear();

    const mes = String(ahora.getMonth() + 1).padStart(2, "0");

    const dia = String(ahora.getDate()).padStart(2, "0");

    enlace.href = url;

    enlace.download = `StockLab_Respaldo_${año}-${mes}-${dia}.json`;

    enlace.click();

    URL.revokeObjectURL(url);

}

const btnImportar = document.getElementById("btnImportar");
const archivoRespaldo = document.getElementById("archivoRespaldo");

btnImportar.addEventListener("click", function(){

    archivoRespaldo.click();

});

archivoRespaldo.addEventListener("change", importarRespaldo);

function importarRespaldo(event){

    const archivo = event.target.files[0];

    if (!archivo) return;

    const confirmar = confirm(
        "¿Desea restaurar el respaldo?\n\n" +
        "Se reemplazarán todos los datos actuales."
    );

    if (!confirmar){

    archivoRespaldo.value = "";

        return;

    }

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e){

        const datos = JSON.parse(e.target.result);

        console.log(datos);

    };

    lector.readAsText(archivo);

}