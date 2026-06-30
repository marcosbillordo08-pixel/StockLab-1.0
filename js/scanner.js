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
