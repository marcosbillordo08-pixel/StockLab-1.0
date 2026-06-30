const botonEscanear = document.getElementById("btnEscanear");
const modalScanner = document.getElementById("modalScanner");
const btnCerrar = document.getElementById("cerrarScanner");

const reader = document.getElementById("reader");

let codeReader = null;
let controles = null;

botonEscanear.addEventListener("click", abrirScanner);
btnCerrar.addEventListener("click", cerrarScanner);

async function abrirScanner() {

    modalScanner.style.display = "flex";

    reader.innerHTML = "";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const dispositivos = await ZXing.BrowserCodeReader.listVideoInputDevices();

        if (dispositivos.length === 0) {

            alert("No se encontró ninguna cámara.");

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

        controles = await codeReader.decodeFromVideoDevice(

            camara.deviceId,

            "reader",

            (resultado, error) => {

                if (resultado) {

                    let codigo = resultado.getText();
                    // Si es un código GS1-128 de Wiener
                    const match = codigo.match(/01(\d{13})/);

                    if (match) {
                        codigo = match[1];
                    }
                    

                    document.getElementById("codigoBarras").value = codigo;

                    cerrarScanner();

                    buscarCodigoBarras();

                }

            }

        );

    } catch (error) {

        console.error(error);

        alert(error);

    }

}

function cerrarScanner() {

    if (controles) {

        controles.stop();

        controles = null;

    }

    if (codeReader) {

        codeReader.reset();

        codeReader = null;

    }

    modalScanner.style.display = "none";

            }
