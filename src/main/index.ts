import path from 'path'
import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { Channels } from '../common/channels';
import {} from './routers/CertificateAuthorityRoute'
import {} from './routers/ClientConfigRoute'

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
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../../index.html')}`
  );

  // Open the DevTools.
  setMainMenu()
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

function sendMenuClickEvent(win: BrowserWindow, menu: string) {
  win.webContents.send(Channels.ROUTE, menu)
}

function setMainMenu() {
  const template = [
    {
      label: 'Certificate Authority',
      async click() {
        sendMenuClickEvent(win, '/ca')
      },
    },
    {
      label: 'Client configuration',
      async click() {
        sendMenuClickEvent(win, '/cc')
      },
    },
    {
      label: 'Admin',
      accelerator: 'CmdOrCtrl+Shift+A',
      async click() {
        sendMenuClickEvent(win, '/admin')
      },
    },
    {
      label: 'Chaincode',
      accelerator: 'CmdOrCtrl+Shift+C',
      async click() {
        sendMenuClickEvent(win, '/chaincode')
      },
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