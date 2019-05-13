const { ipcRenderer } = require("electron");

const pdfList = [];

document.addEventListener("DOMContentLoaded", function() {
    ipcRenderer.send("start-job", { value: 2 });

    const $selectPdf = document.getElementById("select-pdf");
    const $concatPdf = document.getElementById("concat-pdf");

    $pdfList = document.getElementById("pdf-list");

    $selectPdf.addEventListener("click", function() {
        ipcRenderer.send("select-pdf");
    });

    $concatPdf.addEventListener("click", function() {
        ipcRenderer.send("concat-pdf", pdfList);
    });
});

function updateList() {
    $pdfList.innerHTML = pdfList.map(file => `<li>${file}</li>`).join("");
}

ipcRenderer.on("job-started", function(event, arg) {
    console.log(arg);
});

ipcRenderer.on("pdf-selected", function(event, { files }) {
    pdfList.push(...files);

    console.log(pdfList);

    updateList();
});
