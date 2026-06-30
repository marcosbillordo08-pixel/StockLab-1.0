const botonEscanear = document.getElementById("btnEscanear");

botonEscanear.addEventListener("click", () => {

    document.getElementById("reader").style.display = "block";

    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (cameras && cameras.length) {

                const camaraTrasera = cameras[cameras.length - 1];

                html5QrCode.start(
                camaraTrasera.id,
                    {
                        fps: 10,
                        qrbox: 250
                    },
                    (decodedText, decodedResult) => {

                        alert(
                           "Código: " + decodedText +
                           "\n\nFormato: " + 
                    decodedResult.result.format.formatName
                        );

                       html5QrCode.stop();

                    }
                );

            } else {

                alert("No se encontraron cámaras.");

            }

        })
        .catch(err => {

            alert(err);

            console.error(err);

        });

});
