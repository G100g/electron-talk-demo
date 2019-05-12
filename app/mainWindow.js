const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function() {
    ipcRenderer.send("start-job", { value: 2 });
});

ipcRenderer.on("job-started", function(event, arg) {
    console.log(arg);
});
