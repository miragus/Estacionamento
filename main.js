const { app, BrowserWindow, Menu, shell, nativeTheme } = require('electron');
const path = require('path');

let mainWindow = null;

try {
    require('electron-reloader')(module);
} catch (err) {
    console.log('Falha ao carregar o reloader:', err);
}


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        resizable: false,
        icon: 'img/private-garage.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    mainWindow.loadFile('app/inicio.html');
    mainWindow.maximize()
}

app.whenReady().then(() => {
    createWindow();

    nativeTheme.themeSource = 'dark'

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt + F4'
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { role: 'resetZoom' }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Documentação',
                click: () => shell.openExternal('https://drive.google.com/file/d/11C7oLXubJOiLhqKuAM2dKWRDws8nebni/view?usp=sharing')
            },
            { type: 'separator' },
            {
                label: 'Sobre',
                click: () => janelaSobre()
            }
        ]
    }
];

const janelaSobre = () => {
    const sobre = new BrowserWindow({
        width: 500,
        height: 400,
        icon: 'img/transport.ico',
        resizable: false
    });
    sobre.loadFile('app/sobre.html');
};

const janelaDoc = () => {
    const doc = new BrowserWindow ({
        width: 500,
        height: 500,
        icon: 'img/transport.ico',
        resizable: false,
    });
    doc.loadFile('app/doc.html')
}
