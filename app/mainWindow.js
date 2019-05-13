const { ipcRenderer, shell } = require("electron");

const path = require("path");

let pdfList = [];

document.addEventListener("DOMContentLoaded", function() {
    ipcRenderer.send("start-job", { value: 2 });

    const $selectPdf = document.getElementById("select-pdf");
    const $concatPdf = document.getElementById("concat-pdf");
    const $clear = document.getElementById("clear");

    $pdfList = document.getElementById("pdf-list");

    $selectPdf.addEventListener("click", function() {
        ipcRenderer.send("select-pdf");
    });

    $concatPdf.addEventListener("click", function() {
        if (pdfList.length == 2) {
            ipcRenderer.send("concat-pdf", pdfList);
        }
    });

    setupDND($pdfList);

    $clear.addEventListener("click", function() {
        clearList();
    });
});

function setupDND(holder) {
    holder.ondragover = () => {
        return false;
    };

    holder.ondragleave = () => {
        return false;
    };

    holder.ondragend = () => {
        return false;
    };

    holder.ondrop = e => {
        e.preventDefault();

        addFiles([...e.dataTransfer.files].map(({ path }) => path).slice(0, 1));

        updateList();
        return false;
    };
}

function addFiles(files) {
    if (pdfList.length >= 2) {
        shell.beep();
        return;
    }

    for (let filepath of files) {
        pdfList.push(filepath);
    }

    updateList();
}

function clearList() {
    pdfList = [];
    updateList();
}

function updateList() {
    $pdfList.innerHTML = pdfList
        .map(file => `<li>${path.basename(file)}</li>`)
        .join("");
}

ipcRenderer.on("pdf-selected", function(event, { files }) {
    addFiles(files);
});

ipcRenderer.on("create-pdf", function() {
    ipcRenderer.send("concat-pdf", pdfList);
});
