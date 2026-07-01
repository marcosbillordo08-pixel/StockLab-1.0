const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

let controls = null;
let codeReader = null;
let stream = null;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {

    modal.style.display = "flex";

    const reader = document.getElementById("reader");
    console.log(codeReader);
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(codeReader)));

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

            video:{

                facingMode:{
                    ideal:"environment"
                }

            }

        });

        video.srcObject = stream;

        await video.play();

        iniciarZXing(video);

    } catch(e){

        console.error(e);

        alert("No se pudo abrir la cámara.");

    }
}

async function iniciarZXing(video){

    console.log(Object.keys(ZXing));

    try{

        codeReader.decodeFromVideoElement(

            video,

            (result, err)=>{

                if(result){

                    console.log("Código leído:");

                    console.log(result.getText());

                }

            }

        );

    }catch(e){

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

    if(stream){

    stream.getTracks().forEach(track=>track.stop());

    stream = null;

    }

    modal.style.display = "none";

}
