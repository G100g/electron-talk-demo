const {
    app,
    Menu,
    BrowserWindow,
    ipcMain,
    dialog,
    Notification,
    shell
} = require("electron");

const path = require("path");

let win;

const pdfFactory = require("./pdf");
const pdf = pdfFactory();

app.setName("PDF Merge");

function setup() {
    // Create the browser window.
    win = new BrowserWindow({
        title: "PDF Merge",
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
}

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
        setup();
    }
});

// Messages

ipcMain.on("select-pdf", event => {
    const selectedfiles = selectPdf();

    if (selectedfiles) {
        event.reply("pdf-selected", { files: selectedfiles });
    }
});

ipcMain.on("concat-pdf", (event, [a, b]) => {
    concatPdf(a, b);
});

// Functions

function selectPdf() {
    const selectedfiles = dialog.showOpenDialog(win, {
        properties: ["openFile"],
        filters: [{ name: "PDF", extensions: ["pdf"] }]
    });

    if (selectedfiles && selectedfiles.length) {
        const notificaton = new Notification({
            title: "New PDF file selected",
            body: "The file will be merged"
        });

        notificaton.show();
    }

    return selectedfiles;
}

function concatPdf(a, b) {
    const outputPath = dialog.showSaveDialog(win, {
        defaultPath: "concated.pdf"
    });

    if (outputPath) {
        pdf.combine(a, b, outputPath);

        const notificaton = new Notification({
            title: "PDF merged"
        });

        notificaton.show();

        shell.openItem(outputPath);
    }
}

const isMac = process.platform === "darwin";

const template = [
    // { role: 'appMenu' }
    ...(isMac
        ? [
              {
                  label: app.getName(),
                  submenu: [
                      { role: "about" },
                      { type: "separator" },
                      { role: "services" },
                      { type: "separator" },
                      { role: "hide" },
                      { role: "hideothers" },
                      { role: "unhide" },
                      { type: "separator" },
                      { role: "quit" }
                  ]
              }
          ]
        : []),
    // { role: 'fileMenu' }
    {
        label: "File",
        submenu: [
            {
                label: "Select PDF",
                click() {
                    const selectedfiles = selectPdf();
                    if (selectedfiles) {
                        win.webContents.send("pdf-selected", {
                            files: selectedfiles
                        });
                    }
                }
            },
            isMac ? { role: "close" } : { role: "quit" }
        ]
    },
    {
        label: "Actions",
        submenu: [
            {
                label: "Merge PDFs",
                click() {
                    win.webContents.send("create-pdf");
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
