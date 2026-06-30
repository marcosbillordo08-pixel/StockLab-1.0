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

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        alert("ZXing cargado");

        const dispositivos = await ZXing.BrowserCodeReader.listVideoInputDevices();

        alert("Cámaras encontradas: " + dispositivos.length);
        
        if (dispositivos.length === 0) {

            alert("No se encontró ninguna cámara.");

            leyendo = false;

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
        alert("Voy a iniciar la cámara");
        codeReader.decodeFromVideoDevice(

            camara.deviceId,

            "reader",

            (resultado, error) => {

                if (!resultado) return;

                let codigo = resultado.getText();

                // Reactivos Wiener GS1-128
                const match = codigo.match(/01(\d{13})/);

                if (match) {

                    codigo = match[1];

                }

                document.getElementById("codigoBarras").value = codigo;

                cerrarScanner();

                buscarCodigoBarras();

            }

        );

    } catch (e) {
        alert(
            "ERROR:\n\n" +
            e.name +
            "\n\n" +
            e.message
        );

        console.error(e);

        

        leyendo = false;

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
