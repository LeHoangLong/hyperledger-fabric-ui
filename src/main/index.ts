import path from 'path'
import { app, BrowserWindow, Menu, ipcMain } from 'electron'

const isDev = require('electron-is-dev');
const { resolve } = require('path/posix');

let win: BrowserWindow
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(`file://${path.join(__dirname, '../../../index.html')}`);

  // Open the DevTools.
  setMainMenu()
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

function setMainMenu() {
  const template = [
    {
      label: 'Filter',
      submenu: [
        {
          label: 'Hello',
          accelerator: 'Shift+CmdOrCtrl+H',
          async click() {
            win.webContents.send('route', 'Hello 12345')
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length == 0) {
    createWindow()
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});