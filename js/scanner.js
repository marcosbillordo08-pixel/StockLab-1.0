const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");
const reader = document.getElementById("reader");

let stream = null;

btnEscanear.addEventListener("click", abrirScanner);
btnCerrar.addEventListener("click", cerrarScanner);

async function abrirScanner() {

    modal.style.display = "flex";

    reader.innerHTML = `
        <video
            id="videoScanner"
            autoplay
            playsinline
            style="width:100%;height:100%;object-fit:cover;">
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

        video.srcObject = stream;

        await video.play();

        await new Promise(resolve => setTimeout(resolve, 1500));

        if ("BarcodeDetector" in window) {

             iniciarBarcodeDetector(video);

         }

    } catch (error) {

        alert("No se pudo abrir la cámara.");

        console.error(error);

    }

}

function cerrarScanner() {

    modal.style.display = "none";

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

        stream = null;

    }

}

async function iniciarBarcodeDetector(video) {

    const detector = new BarcodeDetector({
        formats: [
            "code_128",
        ]
    });

    async function detectar() {

        if (modal.style.display === "none") return;

        try {

            const codigos = await detector.detect(video);

            if (codigos.length > 0) {

                 const texto = codigos[0].rawValue;

                 console.log(texto);

                 const codigo = obtenerCodigo(texto);

                 document.getElementById("codigoBarras").value = codigo;

                 cerrarScanner();

                 buscarCodigoBarras();

                 return;

             }

        } catch (e) {

            console.error(e);

        }

        requestAnimationFrame(detectar);

    }

    detectar();

}

function obtenerCodigo(texto) {

    texto = texto.replace("]C1", "");

    const inicio = texto.indexOf("01");
    const lote = texto.indexOf("10");

    if (inicio === -1 || lote === -1) {
        return texto;
    }

    return texto.substring(inicio + 2, lote);

}
