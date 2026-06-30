const btnEscanear = document.getElementById("btnEscanear");
const btnCerrar = document.getElementById("cerrarScanner");
const modal = document.getElementById("modalScanner");

btnEscanear.addEventListener("click", abrirScanner);
btnCerrar.addEventListener("click", cerrarScanner);

function abrirScanner() {

    Quagga.stop();
    Quagga.offDetected();

    modal.style.display = "flex";

    Quagga.init({

        inputStream: {

            name: "Live",

            type: "LiveStream",

            target: document.querySelector("#reader"),

            constraints: {

                facingMode: "environment"

            }

        },

        locator: {

            patchSize: "medium",

            halfSample: true

        },

        numOfWorkers: navigator.hardwareConcurrency || 4,

        decoder: {

            readers: [

                "ean_reader",
                "code_128_reader"

            ]

        },

        locate: true

    },

    function(err){

        if(err){

            console.error(err);

            alert(err);

            return;

        }

        Quagga.start();

    });

}

Quagga.offDetected();

Quagga.onDetected(function(resultado){

    if(!resultado.codeResult) return;

    let codigo = resultado.codeResult.code;

    if (!/^\d{13}$/.test(codigo) && !codigo.startsWith("]C1")) {
        return;
    }

    const gs1 = codigo.match(/01(\d{13})/);

    if(gs1){
        codigo = gs1[1];
    }

    document.getElementById("codigoBarras").value = codigo;

    cerrarScanner();

    buscarCodigoBarras();

});

function cerrarScanner(){

    Quagga.stop();

    modal.style.display = "none";

}
