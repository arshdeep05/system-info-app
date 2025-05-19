const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout.trim());
    });
  });
}

async function getUUID() {
  try {
    const platform = os.platform();
    if (platform === 'win32') {
      return await execCommand('wmic csproduct get UUID | findstr /v UUID');
    }
    if (platform === 'darwin') {
      const output = await execCommand(`ioreg -rd1 -c IOPlatformExpertDevice | grep IOPlatformUUID`);
      const match = output.match(/"IOPlatformUUID" = "(.+)"/);
      return match ? match[1] : null;
    }
    if (platform === 'linux') {
      return await execCommand('cat /sys/class/dmi/id/product_uuid');
    }
    return null;
  } catch {
    return null;
  }
}

async function getSerialNumber() {
  try {
    const platform = os.platform();
    if (platform === 'win32') {
      return await execCommand('wmic bios get serialnumber | findstr /v SerialNumber');
    }
    if (platform === 'darwin') {
      const output = await execCommand(`system_profiler SPHardwareDataType | grep "Serial Number"`);
      const match = output.match(/Serial Number \(system\): (.+)/);
      return match ? match[1].trim() : null;
    }
    if (platform === 'linux') {
      // try common locations
      try {
        return await execCommand('cat /sys/class/dmi/id/product_serial');
      } catch {
        return await execCommand('cat /sys/class/dmi/id/board_serial');
      }
    }
    return null;
  } catch {
    return null;
  }
}
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'build', 'index.html'));
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});





ipcMain.handle('get-system-info', async () => {
  return {
      platform: os.platform(),
      arch: os.arch(),
      cpu: os.cpus()[0].model,
      cpuCount: os.cpus().length,
      totalMemGB: (os.totalmem() / (1024 ** 3)).toFixed(2),
      freeMemGB: (os.freemem() / (1024 ** 3)).toFixed(2),
      hostname: os.hostname(),
      release: os.release(),
      userInfo: os.userInfo(),
      uuid: await getUUID(),
      serialNumber: await getSerialNumber(),
    }
});