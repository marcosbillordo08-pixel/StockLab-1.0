const botonEscanear = document.getElementById("btnEscanear");
const modalScanner = document.getElementById("modalScanner");
const btnCerrar = document.getElementById("cerrarScanner");

let html5QrCode = null;
let escanerActivo = false;

botonEscanear.addEventListener("click", iniciarEscaner);

btnCerrar.addEventListener("click", cerrarEscaner);

async function iniciarEscaner() {

    if (escanerActivo) return;

    modalScanner.style.display = "flex";

    html5QrCode = new Html5Qrcode("reader");

    try {

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras.length) {

            alert("No se encontró ninguna cámara.");

            modalScanner.style.display = "none";

            return;

        }

        // Busca una cámara trasera
        let camara = cameras.find(c =>
            c.label.toLowerCase().includes("back") ||
            c.label.toLowerCase().includes("rear") ||
            c.label.toLowerCase().includes("tras")
        );

        if (!camara) {
            camara = cameras[cameras.length - 1];
        }

        escanerActivo = true;

        await html5QrCode.start(

            camara.id,

            {
                fps: 15,
                qrbox: {
                    width: 300,
                    height: 150
                }
            },

            codigoLeido

        );

    } catch (error) {

        alert(error);

        console.error(error);

        modalScanner.style.display = "none";

    }

}

async function codigoLeido(decodedText) {

    document.getElementById("codigoBarras").value = decodedText;

    await cerrarEscaner();

    buscarCodigoBarras();

}

async function cerrarEscaner() {

    if (!escanerActivo) {

        modalScanner.style.display = "none";

        return;

    }

    try {

        await html5QrCode.stop();

        await html5QrCode.clear();

    } catch (e) {

        console.log(e);

    }

    escanerActivo = false;

    modalScanner.style.display = "none";

}
