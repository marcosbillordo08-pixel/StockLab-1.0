const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

let stream = null;

btnEscanear.onclick = abrirScanner;
btnCerrar.onclick = cerrarScanner;

async function abrirScanner() {

    modal.style.display = "flex";

    const reader = document.getElementById("reader");

    reader.innerHTML = `
        <video id="videoScanner"
               autoplay
               playsinline
               style="width:100%;border-radius:10px;">
        </video>
    `;

    const video = document.getElementById("videoScanner");

    stream = await navigator.mediaDevices.getUserMedia({
        video:{
            facingMode:{
                ideal:"environment"
            }
        }
    });

    video.srcObject = stream;

    if(!("BarcodeDetector" in window)){
        alert("Este navegador no soporta BarcodeDetector.");
        return;
    }

    const detector = new BarcodeDetector({
        formats:[
            "ean_13",
            "code_128",
            "qr_code"
        ]
    });

    async function detectar(){

        if(modal.style.display==="none") return;

        try{

            const codigos = await detector.detect(video);

            if(codigos.length){

                let texto = codigos[0].rawValue;

                console.log(texto);

                if(texto.includes("wlab.ar")){

                    const partes = texto.split("/");

                    const pos01 = partes.indexOf("01");
                    const pos10 = partes.indexOf("10");

                    if(pos01!=-1){

                        document.getElementById("codigoBarras").value =
                        partes[pos01+1];

                    }

                    if(pos10!=-1){

                        document.getElementById("lote").value =
                        partes[pos10+1];

                    }

                }else{

                    document.getElementById("codigoBarras").value = obtenerCodigo(texto);

                }

                cerrarScanner();

                buscarCodigoBarras();

                return;

            }

        }catch(e){

            console.error(e);

        }

        requestAnimationFrame(detectar);

    }

    detectar();

}

function cerrarScanner(){

    modal.style.display="none";

    if(stream){

        stream.getTracks().forEach(track=>track.stop());

        stream=null;

    }

}

function obtenerCodigo(texto){

    // Quitar el prefijo GS1
    texto = texto.replace("]C1", "");

    // Buscar AI 01 (GTIN)
    const indice = texto.indexOf("01");

    if(indice === -1){

        return texto;

    }

    // Tomar los 14 dígitos del GTIN
    const gtin = texto.substring(indice + 2, indice + 16);

    // Convertir a 13 dígitos (como usa tu base)
    return gtin.substring(0,13);

}
