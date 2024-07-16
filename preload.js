const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getFromLocalStorage: key => localStorage.getItem(key),
    saveToLocalStorage: (key, value) => localStorage.setItem(key, value)
    // Adicione outras funções do Electron que você deseja expor aqui
});
