const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");
const inputCodigoBarras = document.getElementById("codigoBarras");
const readerContenedor = document.getElementById("reader");

let stream = null;
let codeReader = null;
let controls = null;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {

    modal.style.display = "flex";

    // saca un video anterior si quedó de una apertura previa,
    // sin tocar el marco guía (.scan-guide) ni el texto de ayuda
    const videoViejo = document.getElementById("videoScanner");
    if (videoViejo) {
        videoViejo.remove();
    }

    const video = document.createElement("video");
    video.id = "videoScanner";
    video.autoplay = true;
    video.playsInline = true; // clave en iOS: evita que Safari abra el video a pantalla completa
    video.muted = true;

    // el video va PRIMERO, así el marco guía (position:absolute) queda dibujado encima
    readerContenedor.insertBefore(video, readerContenedor.firstChild);

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }
            }
        });

        video.srcObject = stream;
        await video.play();

        iniciarZXing(video);

    } catch (e) {
        console.error(e);

        // en iOS y Android, getUserMedia solo funciona si la página se sirve por HTTPS (o localhost)
        if (location.protocol !== "https:" && location.hostname !== "localhost") {
            alert("La cámara solo funciona si la página se abre por HTTPS. Actualmente está en: " + location.protocol);
        } else if (e.name === "NotAllowedError") {
            alert("No se dio permiso para usar la cámara. Revisá los permisos de tu navegador para este sitio.");
        } else if (e.name === "NotFoundError") {
            alert("No se encontró ninguna cámara en este dispositivo.");
        } else {
            alert("No se pudo abrir la cámara: " + e.message);
        }
    }
}

async function iniciarZXing(video) {

    // el paquete @zxing/browser expone su API global como "ZXingBrowser", no como "ZXing"
    codeReader = new ZXingBrowser.BrowserMultiFormatReader();

    try {
        // esta versión de la librería exige un callback: se ejecuta en
        // cada frame, con (result, error, controls). No es opcional.
        controls = await codeReader.decodeFromVideoElement(video, (result, error, ctrls) => {

            if (result) {
                const texto = result.getText();
                console.log("Código detectado:", texto);

                inputCodigoBarras.value = texto;

                const mensaje = document.getElementById("mensajeCodigo");
                if (mensaje) {
                    mensaje.textContent = "✅ Código leído: " + texto;
                    mensaje.style.color = "";
                }

                inputCodigoBarras.dispatchEvent(new Event("input", { bubbles: true }));

                cerrarScanner();
            }

            // "error" se dispara en CADA frame donde no encuentra nada;
            // es normal, no significa que algo falló
        });

    } catch (e) {
        console.error(e);
        alert("No se pudo iniciar el lector: " + e.message);
    }
}

function cerrarScanner() {

    if (controls) {
        controls.stop();
        controls = null;
    }

    codeReader = null;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    const video = document.getElementById("videoScanner");
    if (video) {
        video.remove();
    }

    modal.style.display = "none";
}
