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
                facingMode: { ideal: "environment" },
                // pedir una resolución más chica acelera muchísimo el análisis de
                // cada frame; 1280x720 alcanza de sobra para leer códigos de barras
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        video.srcObject = stream;
        await video.play();

        iniciarZXing(video);

    } catch (e) {
        console.error(e);

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

    // restringir los formatos posibles hace que el lector deje de probar QR,
    // PDF417, Aztec, etc. en cada frame — es la mejora de velocidad más grande
    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
        ZXing.BarcodeFormat.CODE_128,   // GS1-128, el más común en reactivos de laboratorio
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.ITF,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.QR_CODE,     // por si el código es un GS1 Digital Link (URL)
        ZXing.BarcodeFormat.DATA_MATRIX  // habitual en insumos/reactivos en formato 2D
    ]);

    // el paquete @zxing/browser expone su API global como "ZXingBrowser", no como "ZXing"
    codeReader = new ZXingBrowser.BrowserMultiFormatReader(hints);

    try {
        controls = await codeReader.decodeFromVideoElement(video, (result, error, ctrls) => {

            if (result) {
                const textoCrudo = result.getText();
                const formato = result.getBarcodeFormat();

                const texto = extraerGTIN(textoCrudo, formato);

                console.log("Código detectado (crudo):", textoCrudo, "→ usado:", texto);

                inputCodigoBarras.value = texto;

                // se dispara "change" (no "input") a propósito: es el evento que
                // escucha app.js para correr limpiarCodigoBarras() y sobre todo
                // buscarProductoPorCodigo(), que autocompleta Marca, Presentación,
                // Tipo de Reactivo, R1/R2 y el mensaje de encontrado/no encontrado.
                // Así el escaneo por cámara se comporta igual que si lo tipeara
                // una pistola lectora física.
                inputCodigoBarras.dispatchEvent(new Event("change", { bubbles: true }));

                cerrarScanner();
            }

            // "error" se dispara en CADA frame donde no encuentra nada; es normal
        });

    } catch (e) {
        console.error(e);
        alert("No se pudo iniciar el lector: " + e.message);
    }
}

/**
 * Los códigos GS1 (típicos en reactivos/insumos de laboratorio) no traen
 * solo el número de producto: vienen envueltos en "Application Identifiers".
 * Por ejemplo:
 *   wlab.ar/01/7798100043296/10/2511666600   (GS1 Digital Link, un QR o DataMatrix)
 *   010177981000404550102507650230           (GS1-128 "crudo", sin separadores)
 * En ambos casos, el AI "01" indica que lo que sigue es el GTIN (el código
 * de producto real). Esta función se queda solo con eso.
 *
 * Los formatos EAN-13/EAN-8/UPC nunca usan AIs — se devuelven tal cual,
 * para no romper el escaneo de un código simple que casualmente empiece con "01".
 */
function extraerGTIN(textoCrudo, formato) {

    const formatosSinAI = [
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.UPC_E
    ];

    if (formatosSinAI.includes(formato)) {
        return textoCrudo;
    }

    // Formato GS1 Digital Link (URL): dominio/01/<GTIN>/10/<lote>/...
    const matchUrl = textoCrudo.match(/\/01\/(\d+)/);
    if (matchUrl) {
        return normalizarGTIN(matchUrl[1]);
    }

    // Formato GS1-128 "crudo": arranca con el AI 01 seguido de 14 dígitos de GTIN
    const matchCrudo = textoCrudo.match(/^01(\d{14})/);
    if (matchCrudo) {
        return normalizarGTIN(matchCrudo[1]);
    }

    // no es un patrón GS1 reconocido: se deja tal cual (código interno propio, etc.)
    return textoCrudo;
}

function normalizarGTIN(gtin) {
    // el "0" de relleno que convierte un EAN-13 en GTIN-14 se saca,
    // para que quede el mismo número que tiene impreso el producto
    if (gtin.length === 14 && gtin.startsWith("0")) {
        return gtin.slice(1);
    }
    return gtin;
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
