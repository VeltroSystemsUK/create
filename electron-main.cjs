const { app, BrowserWindow, Menu, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

// Disable GPU acceleration on Windows to avoid crashes
app.disableHardwareAcceleration();

let mainWindow;
let backendProcess;
let frontendProcess;

const appDir = __dirname;
const backendPath = isDev
  ? path.join(appDir, 'server')
  : path.join(process.resourcesPath, 'server');

function createWindow() {
  const iconPath = path.join(appDir, 'assets', 'icon.png');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(appDir, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(appDir, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackendServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(backendPath, 'server.js');

    if (!fs.existsSync(serverPath)) {
      console.error('Server file not found:', serverPath);
      reject(new Error('Backend server not found'));
      return;
    }

    console.log('Starting backend at:', serverPath);
    backendProcess = spawn('node', [serverPath], {
      cwd: backendPath,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: isDev ? 'development' : 'production',
      },
    });

    let serverReady = false;
    const timeout = setTimeout(() => {
      if (!serverReady) {
        console.error('Backend server startup timeout');
        reject(new Error('Backend startup timeout'));
      }
    }, 10000);

    backendProcess.stdout.on('data', (data) => {
      const message = data.toString();
      console.log('[Backend]', message);

      if (message.includes('running on port 3001') || message.includes('initialized')) {
        serverReady = true;
        clearTimeout(timeout);
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error('[Backend Error]', data.toString());
    });

    backendProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function startFrontendServer() {
  return new Promise((resolve) => {
    if (!isDev) {
      resolve();
      return;
    }

    console.log('Starting Vite dev server...');
    frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: appDir,
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    });

    let frontendReady = false;
    const timeout = setTimeout(() => {
      console.log('Frontend startup timeout - continuing anyway');
      resolve();
    }, 25000);

    const onData = (data) => {
      const message = data.toString();
      console.log('[Vite]', message);

      if (message.includes('localhost:3000') || message.includes('ready in')) {
        if (!frontendReady) {
          frontendReady = true;
          clearTimeout(timeout);
          resolve();
        }
      }
    };

    frontendProcess.stdout.on('data', onData);
    frontendProcess.stderr.on('data', onData);

    frontendProcess.on('error', (err) => {
      console.error('Frontend error:', err);
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function startServers() {
  try {
    console.log('Starting backend server...');
    await startBackendServer();
    console.log('✓ Backend started successfully');

    await new Promise(r => setTimeout(r, 1000));

    console.log('Starting frontend server...');
    await startFrontendServer();
    console.log('✓ Frontend server started');

    await new Promise(r => setTimeout(r, 2000));
  } catch (error) {
    console.error('Failed to start servers:', error);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start application:\n${error.message}`
    );
    app.quit();
  }
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', async () => {
  console.log('App is ready');
  createMenu();
  await startServers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

process.on('exit', () => {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
});

process.on('uncaughtException', (error) => {
  console.error('Error:', error);
  if (mainWindow) dialog.showErrorBox('Error', error.message);
});
