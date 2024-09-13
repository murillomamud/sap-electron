const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let statusWindow = null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

function createStatusWindow() {
  statusWindow = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  statusWindow.loadFile('status.html');
  statusWindow.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();
  console.log('App is ready!');

  ipcMain.on('launch-sap', (event, index) => {
    console.log('Launching SAP...');

    // Mostrar a janela de status
    createStatusWindow();

    // Caminho do arquivo de configuração
    const configPath = path.join(__dirname, 'config.json');

    // Ler o arquivo de configuração
    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading config file:', err);
        return;
      }

      // Parse o JSON
      const config = JSON.parse(data);

      // Verifique se o índice é válido
      if (index < 0 || index >= config.length) {
        console.error('Invalid index');
        return;
      }

      // Obter os parâmetros da configuração selecionada
      const selectedConfig = config[index];
      const params = selectedConfig.params;

      // Divida os parâmetros corretamente
      const args = params.split(/\s+(?=-)/); // Divide pelos espaços seguidos por um -

      // Caminho fixo do SAP GUI
      const sapGuiPath = "C:\\Program Files (x86)\\SAP\\FrontEnd\\SAPgui\\sapshcut.exe";

      // Log para verificar os argumentos
      console.log(`Executing command: ${sapGuiPath} ${args.join(' ')}`);

      console.log(args);

      // Iniciar o SAP GUI com parâmetros ajustados
      const sapProcess = spawn(sapGuiPath, args, { detached: true, stdio: 'ignore' });

      console.log(`SAP GUI PID: ${sapProcess.pid}`);

      // Desanexar o processo para evitar que a aplicação fique bloqueada
      sapProcess.unref();

      // Monitorar erros
      sapProcess.on('error', (error) => {
        console.error(`spawn error: ${error}`);
      });

      // Fechar a janela de status após 5 segundos
      setTimeout(() => {
        if (statusWindow) {
          statusWindow.close();
          statusWindow = null;
        }
      }, 5000); // Ajuste o tempo conforme necessário
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
