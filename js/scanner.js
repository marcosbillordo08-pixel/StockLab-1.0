const botonEscanear = document.getElementById("btnEscanear");

botonEscanear.addEventListener("click", () => {

    document.getElementById("reader").style.display = "block";

    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (cameras && cameras.length) {

                html5QrCode.start(
                    cameras[0].id,
                    {
                        fps: 10,
                        qrbox: 250
                    },
                    (decodedText) => {

                        alert(decodedText);

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
