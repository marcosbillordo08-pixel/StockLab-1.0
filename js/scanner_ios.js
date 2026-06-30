const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

let controls = null;
let codeReader = null;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {

    modal.style.display = "flex";

    codeReader = new ZXing.BrowserMultiFormatReader();

    try {

        const devices = await ZXing.BrowserCodeReader.listVideoInputDevices();
        console.log(devices);
        alert("Cámaras encontradas: " + devices.length);

        if (!devices.length) {
            alert("No se encontró ninguna cámara.");
            return;
        }

        let camera = devices[devices.length - 1];
        console.log(camera);

        controls = await codeReader.decodeFromVideoDevice(

            camera.deviceId,

            "reader",

            (result, err) => {

                if (result) {

                    console.log("Código leído:");

                    console.log(result.getText());

                }

            }

        );

    } catch (e) {

        console.error(e);

        alert("Error iniciando ZXing");

    }

}

function cerrarScanner() {

    if (controls) {

        controls.stop();

        controls = null;

    }

    if (codeReader) {

        codeReader.reset();

        codeReader = null;

    }

    modal.style.display = "none";

}
