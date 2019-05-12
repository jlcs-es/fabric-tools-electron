import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import * as isDev from 'electron-is-dev';
let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1000, height: 700 });
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});