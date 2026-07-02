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

btnImportar.addEventListener("click", function () {

    archivoRespaldo.click();

});

archivoRespaldo.addEventListener("change", importarRespaldo);

function importarRespaldo(event) {

    const archivo = event.target.files[0];

    if (!archivo) return;

    const confirmar = confirm(
        "¿Desea restaurar el respaldo?\n\n" +
        "Los movimientos del archivo se van a agregar/actualizar en la base " +
        "compartida, y van a quedar visibles para todos los usuarios."
    );

    if (!confirmar) {

        archivoRespaldo.value = "";

        return;

    }

    const lector = new FileReader();

    lector.onload = async function (e) {

        try {

            const datos = JSON.parse(e.target.result);

            if (!datos.movimientos || !Array.isArray(datos.movimientos)) {

                alert("El archivo no tiene el formato esperado.");

                return;

            }

            // Firestore permite hasta 500 operaciones por lote (batch).
            // Si el respaldo tiene más de 500 movimientos, los mandamos
            // en varios lotes seguidos.

            const grupos = [];

            for (let i = 0; i < datos.movimientos.length; i += 450) {

                grupos.push(datos.movimientos.slice(i, i + 450));

            }

            for (const grupo of grupos) {

                const lote = db.batch();

                grupo.forEach(function (movimiento) {

                    const ref = db.collection("movimientos").doc(String(movimiento.id));

                    lote.set(ref, movimiento);

                });

                await lote.commit();

            }

            alert("Respaldo restaurado con éxito (" + datos.movimientos.length + " movimientos).");

        } catch (error) {

            console.error(error);

            alert("Error al restaurar el respaldo: " + error.message);

        } finally {

            archivoRespaldo.value = "";

        }

    };

    lector.readAsText(archivo);

}
