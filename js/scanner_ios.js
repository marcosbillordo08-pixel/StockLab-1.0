const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

let stream = null;
let codeReader = null;
let controls = null;
let codigoYaDetectado = false;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

function logEstado(mensaje) {

    console.log(mensaje);

    const estado = document.getElementById("mensajeCodigo");

    if (estado) {

        estado.innerHTML += mensaje + "<br>";

    }

}

async function abrirScanner() {

    codigoYaDetectado = false;

    logEstado("📷 Abriendo cámara...");

    modal.style.display = "flex";

    const reader = document.getElementById("reader");

    reader.innerHTML = `
        <video
            id="videoScanner"
            autoplay
            playsinline
            muted
            style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
        </video>
    `;

    const video = document.getElementById("videoScanner");

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment"
                }
            }
        });

        logEstado("✅ Cámara iniciada");

        video.srcObject = stream;

        await video.play();

        logEstado("🎯 Enfocando cámara...");

        iniciarZXing(video);

    } catch (e) {

        console.error(e);

        logEstado("❌ Error al abrir la cámara: " + e.message);

    }

}

async function iniciarZXing(video) {

    logEstado("🔍 Iniciando ZXing...");

    try {

        codeReader = new ZXingBrowser.BrowserMultiFormatReader();

        logEstado("✅ ZXing cargado");

        controls = await codeReader.decodeFromVideoDevice(

            null,

            video,

            (result, err) => {

                if (result && !codigoYaDetectado) {

                    codigoYaDetectado = true;

                    let codigo = result.getText();

                    codigo = limpiarCodigoBarras(codigo);

                    logEstado("📦 Código detectado: " + codigo);

                    const campoCodigoBarras = document.getElementById("codigoBarras");

                    campoCodigoBarras.value = codigo;

                    buscarProductoPorCodigo(codigo);

                    cerrarScanner();

                }

                if (err) {

                    // No mostramos errores continuamente
                    // porque ZXing genera muchos mientras busca.

                }

            }

        );

    } catch (e) {

        console.error(e);

        logEstado("❌ Error iniciando ZXing: " + e.message);

    }

}

function cerrarScanner() {

    logEstado("🛑 Cerrando escáner...");

    if (controls) {

        controls.stop();
        controls = null;

    }

    if (codeReader) {

        codeReader.reset();
        codeReader = null;

    }

    if (stream) {

        stream.getTracks().forEach(track => track.stop());
        stream = null;

    }

    modal.style.display = "none";

    logEstado("✅ Escáner cerrado");

}
