const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const dataFilePath = app.isPackaged
  ? path.join(path.dirname(app.getPath('exe')), 'jobs.json')
  : path.join(__dirname, 'jobs.json');

function initDataFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({ jobs: [] }, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing data file:', err);
  }
}

function loadJobs() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading jobs:', err);
  }
  return { jobs: [] };
}

function saveJobs(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving jobs:', err);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon:path.join(__dirname,'icon.ico'),
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('load-jobs', () => {
  return loadJobs();
});

ipcMain.handle('save-jobs', (event, data) => {
  return saveJobs(data);
});

app.whenReady().then(() => {
  initDataFile();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});