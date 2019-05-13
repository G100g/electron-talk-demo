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

    $pdfList.addEventListener("drop", e => {
        e.preventDefault();

        for (let f of e.dataTransfer.files) {
            console.log("File(s) you dragged here: ", f.path);
        }
        // ipcRenderer.send('ondragstart', '/path/to/item')
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
