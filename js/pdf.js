const botonPDF = document.getElementById("btnPDF");

botonPDF.addEventListener("click", generarPDF);

function generarPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("l", "mm", "a4");

    const logo = new Image();

    logo.src = "img/logo.png";

    // se genera el reporte tanto si el logo carga bien como si falla,
    // para no dejar el botón "colgado" sin ningún PDF ni error visible
    logo.onload = function () {
        construirReporte(true);
    };

    logo.onerror = function () {
        console.warn("No se pudo cargar img/logo.png, se genera el PDF sin logo.");
        construirReporte(false);
    };

    function construirReporte(incluirLogo) {

        if (incluirLogo) {
            pdf.addImage(logo, "PNG", 15, 8, 45, 25);
        }

        const anchoPagina = pdf.internal.pageSize.getWidth();
        const altoPagina = pdf.internal.pageSize.getHeight();

        const fecha = new Date();

        const fechaTexto = fecha.toLocaleDateString();
        const horaTexto = fecha.toLocaleTimeString();

        // Estadísticas

        let totalEntradas = 0;
        let totalSalidas = 0;

        movimientos.forEach(function (movimiento) {

            if (movimiento.tipo === "ENTRADA") {
                totalEntradas++;
            } else {
                totalSalidas++;
            }

        });

        // Productos con stock

        const productosStock = new Set();

        movimientos.forEach(function (movimiento) {

            if (movimiento.tipo === "ENTRADA") {
                productosStock.add(movimiento.producto);
            }

        });

        const totalProductos = productosStock.size;

        // Productos por vencer

        let porVencer = 0;

        movimientos.forEach(function (movimiento) {

            if (movimiento.vencimiento) {

                const hoy = new Date();
                const vencimiento = new Date(movimiento.vencimiento);
                const dias = (vencimiento - hoy) / (1000 * 60 * 60 * 24);

                if (dias <= 30 && dias >= 0) {
                    porVencer++;
                }

            }

        });

        const categoria = document.getElementById("filtroPDF").value;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("STOCKLAB", anchoPagina / 2, 15, { align: "center" });

        pdf.setFontSize(14);
        pdf.text("REPORTE DE MOVIMIENTOS", anchoPagina / 2, 24, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);

        pdf.text(`Fecha: ${fechaTexto}`, 15, 40);
        pdf.text(`Hora: ${horaTexto}`, 15, 47);

        pdf.line(15, 52, anchoPagina - 15, 52);

        pdf.text(`Total de Entradas: ${totalEntradas}`, 15, 62);
        pdf.text(`Total de Salidas: ${totalSalidas}`, 15, 69);
        pdf.text(`Productos con Stock: ${totalProductos}`, 15, 76);
        pdf.text(`Productos por Vencer: ${porVencer}`, 15, 83);
        pdf.text(`Categoría: ${categoria}`, 15, 90);

        pdf.line(15, 95, anchoPagina - 15, 95);

        pdf.setFont("helvetica", "bold");
        pdf.text("ENTRADAS", 15, 105);

        const filasEntradas = [];

        movimientos.forEach(function (movimiento) {

            if (movimiento.tipo !== "ENTRADA") return;
            if (categoria !== "TODOS" && movimiento.categoria !== categoria) return;

            filasEntradas.push([
                movimiento.fecha,
                movimiento.producto,
                movimiento.marca,
                movimiento.codigo,
                movimiento.codigoBarras,
                movimiento.presentacion,
                movimiento.tipoReactivo,
                movimiento.r1,
                movimiento.r2,
                movimiento.lote,
                movimiento.vencimiento,
                movimiento.cantidad
            ]);

        });

        pdf.autoTable({

            startY: 110,
            tableWidth: "auto",

            margin: {
                left: 15,
                right: 15
            },

            tableWidth: anchoPagina - 30,

            head: [[
                "Fecha",
                "Producto",
                "Marca",
                "Cod. Ref.",
                "Cód. Barras",
                "Present.",
                "Tipo",
                "R1",
                "R2",
                "Lote",
                "Vto",
                "Cant."
            ]],

            body: filasEntradas,

            theme: "grid",

            headStyles: {
                fillColor: [46, 125, 50],
                textColor: 255,
                fontStyle: "bold",
                halign: "center"
            },

            styles: {
                fontSize: 8,
                cellPadding: 2,
                halign: "center",
                valign: "middle"
            },

        });

        pdf.text("SALIDAS", 15, pdf.lastAutoTable.finalY + 12);

        const filasSalidas = [];

        movimientos.forEach(function (movimiento) {

            if (movimiento.tipo !== "SALIDA") return;
            if (categoria !== "TODOS" && movimiento.categoria !== categoria) return;

            filasSalidas.push([
                movimiento.fecha,
                movimiento.producto,
                movimiento.marca,
                movimiento.codigo,
                movimiento.codigoBarras,
                movimiento.presentacion,
                movimiento.componenteSalida,
                movimiento.lote,
                movimiento.cantidad
            ]);

        });

        pdf.autoTable({

            startY: pdf.lastAutoTable.finalY + 18,

            head: [[
                "Fecha",
                "Producto",
                "Marca",
                "Cod. Ref.",
                "Cód. Barras",
                "Present.",
                "Componente",
                "Lote",
                "Cant."
            ]],

            body: filasSalidas,

            theme: "grid",

            headStyles: {
                fillColor: [183, 28, 28], // Rojo
                textColor: 255,
                fontStyle: "bold",
                fontSize: 8
            },

            styles: {
                fontSize: 8,
                cellPadding: 2
            }

        });

        const ahora = new Date();

        const año = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, "0");
        const dia = String(ahora.getDate()).padStart(2, "0");
        const hora = String(ahora.getHours()).padStart(2, "0");
        const minutos = String(ahora.getMinutes()).padStart(2, "0");

        const nombrePDF = `StockLab_${año}-${mes}-${dia}_${hora}-${minutos}.pdf`;

        const posicionFinal = pdf.lastAutoTable.finalY + 15;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        pdf.line(15, posicionFinal, anchoPagina - 15, posicionFinal);

        pdf.text("StockLab v1.0", 15, posicionFinal + 8);

        pdf.text(
            `Reporte generado automáticamente el ${fechaTexto} a las ${horaTexto}`,
            15,
            posicionFinal + 14
        );

        pdf.save(nombrePDF);

    }

}
