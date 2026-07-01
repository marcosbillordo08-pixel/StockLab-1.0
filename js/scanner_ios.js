const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");
const inputCodigoBarras = document.getElementById("codigoBarras");

let stream = null;
let codeReader = null;
let controls = null;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {

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
                facingMode: { ideal: "environment" }
            }
        });

        video.srcObject = stream;
        await video.play();

        iniciarZXing(video);

    } catch (e) {
        console.error(e);

        // en iOS, getUserMedia solo funciona si la página se sirve por HTTPS (o localhost)
        if (location.protocol !== "https:" && location.hostname !== "localhost") {
            alert("La cámara solo funciona si la página se abre por HTTPS. Actualmente está en: " + location.protocol);
        } else if (e.name === "NotAllowedError") {
            alert("No se dio permiso para usar la cámara. Revisá los permisos de Safari para este sitio.");
        } else {
            alert("No se pudo abrir la cámara: " + e.message);
        }
    }
}

async function iniciarZXing(video) {

    // el paquete @zxing/browser expone su API global como "ZXingBrowser", no como "ZXing"
    // (ese era el bug: ZXing nunca existió, por eso saltaba el alert apenas abría la cámara)
    codeReader = new ZXingBrowser.BrowserMultiFormatReader();

    try {
        const result = await codeReader.decodeFromVideoElement(video);

        if (result) {
            const texto = result.getText();
            console.log("Código detectado:", texto);

            inputCodigoBarras.value = texto;

            const mensaje = document.getElementById("mensajeCodigo");
            if (mensaje) {
                mensaje.textContent = "✅ Código leído: " + texto;
                mensaje.style.color = "";
            }

            cerrarScanner();

            // dispara el evento 'input' por si tu app.js escucha cambios en el campo
            inputCodigoBarras.dispatchEvent(new Event("input", { bubbles: true }));
        }

    } catch (e) {
        console.error(e);
        alert("No se pudo leer el código: " + e.message);
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

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    modal.style.display = "none";
}
