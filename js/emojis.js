(function () {

    if (typeof twemoji === "undefined") {
        console.warn("Twemoji no cargó (¿sin conexión?); los emojis van a depender de la fuente del sistema.");
        return;
    }

    const opciones = {
        folder: "svg",
        ext: ".svg"
    };

    // convierte los emojis que ya están en la página al cargar
    twemoji.parse(document.body, opciones);

    // convierte los emojis que se agreguen después dinámicamente
    // (filas de tablas, mensajes de "producto encontrado", estadísticas, etc.)
    // sin necesidad de tocar cada script que genera contenido
    let pendiente = null;

    const observer = new MutationObserver(function () {

        if (pendiente) return;

        pendiente = requestAnimationFrame(function () {
            twemoji.parse(document.body, opciones);
            pendiente = null;
        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

})();
