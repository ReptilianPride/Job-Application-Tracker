const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadJobs: () => ipcRenderer.invoke('load-jobs'),
  saveJobs: (data) => ipcRenderer.invoke('save-jobs', data)
});