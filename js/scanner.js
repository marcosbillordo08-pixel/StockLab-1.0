const botonEscanear = document.getElementById("btnEscanear");
const modalScanner = document.getElementById("modalScanner");
const btnCerrar = document.getElementById("cerrarScanner");

let codeReader = null;
let leyendo = false;

botonEscanear.addEventListener("click", abrirScanner);
btnCerrar.addEventListener("click", cerrarScanner);

async function abrirScanner() {

    if (leyendo) return;

    leyendo = true;

    modalScanner.style.display = "flex";

    document.getElementById("reader").innerHTML = "";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const dispositivos = await ZXing.BrowserCodeReader.listVideoInputDevices();

        if (!dispositivos.length) {

            alert("No se encontró ninguna cámara.");

            cerrarScanner();

            return;

        }

        let camara = dispositivos.find(c =>
            c.label.toLowerCase().includes("back") ||
            c.label.toLowerCase().includes("rear") ||
            c.label.toLowerCase().includes("tras")
        );

        if (!camara) {

            camara = dispositivos[dispositivos.length - 1];

        }

        codeReader.decodeFromVideoDevice(

            camara.deviceId,

            "reader",

            (resultado, error) => {

                if (!resultado) return;

                let codigo = resultado.getText();

                // Reactivos Wiener GS1-128
                const gs1 = codigo.match(/01(\d{13})/);

                if (gs1) {

                    codigo = gs1[1];

                }

                document.getElementById("codigoBarras").value = codigo;

                cerrarScanner();

                buscarCodigoBarras();

            }

        );

    } catch (e) {

        console.error(e);

        alert("Error al iniciar la cámara");

        cerrarScanner();

    }

}

function cerrarScanner() {

    leyendo = false;

    if (codeReader) {

        codeReader.reset();

        codeReader = null;

    }

    modalScanner.style.display = "none";

}
