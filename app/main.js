const {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
    Notification
} = require("electron");
const path = require("path");

const pdfFactory = require("./pdf");

const pdf = pdfFactory();

function setup() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, "mainWindow.html"));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    // Messages

    ipcMain.on("select-pdf", event => {
        const selectedfiles = dialog.showOpenDialog(win, {
            properties: ["openFile"],
            filters: [{ name: "PDF", extensions: ["pdf"] }]
        });

        const notificaton = new Notification({
            title: "New PDF file selected",
            body: "The file will be merged"
        });

        notificaton.show();

        event.reply("pdf-selected", { files: selectedfiles });
    });

    ipcMain.on("concat-pdf", (event, [a, b]) => {
        const outputPath = dialog.showSaveDialog(win, {
            defaultPath: "concated.pdf"
            // filters: [{ name: "PDF", extensions: ["pdf"] }]
        });
        console.log(outputPath);
        pdf.combine(a, b, outputPath);
        // event.reply("pdf-selected", { files: selectedfiles });
    });
}

app,
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", setup);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// ipcMain.on("start-job", (event, { a, b }) => {
//     event.reply("job-started", { a, b });

// });
