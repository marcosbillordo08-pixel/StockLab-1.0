const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

// Asegúrate de inicializar codeReader globalmente si no lo hacías antes, por ejemplo:
// const codeReader = new ZXing.BrowserBarcodeReader();
let codeReader = new ZXing.BrowserMultiFormatReader(); // O el reader que uses

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {
    modal.style.display = "flex";

    const reader = document.getElementById("reader");

    // Inyectamos el video de forma limpia
    reader.innerHTML = `
        <video
            id="videoScanner"
            style="width:100%;height:100%;object-fit:cover;border-radius:10px;">
        </video>
    `;

    const video = document.getElementById("videoScanner");
    
    // Forzamos los atributos vitales para iOS mediante JS antes de encender la cámara
    video.setAttribute("playsinline", "true");
    video.setAttribute("muted", "true");
    video.removeAttribute("controls"); 

    try {
        // Dejamos que ZXing maneje la cámara trasera ('environment') directamente
        codeReader.decodeFromVideoDevice(undefined, video, (result, err) => {
            if (result) {
                console.log("Código leído:", result.getText());
                alert("Código detectado: " + result.getText());
                
                // Opcional: Si quieres que se cierre solo al leer un código
                cerrarScanner(); 
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                // Ignoramos los "NotFoundException" porque ZXing tira ese error 
                // continuamente cada milisegundo que NO ve un código de barras.
                console.error(err);
            }
        });

    } catch (e) {
        console.error(e);
        alert("No se pudo abrir la cámara o iniciar ZXing.");
    }
}

function cerrarScanner() {
    if (codeReader) {
        // reset() de ZXing apaga automáticamente la cámara, frena el stream y limpia el video
        codeReader.reset(); 
    }

    modal.style.display = "none";
    
    const reader = document.getElementById("reader");
    if (reader) reader.innerHTML = ""; // Limpiamos el contenedor
}
