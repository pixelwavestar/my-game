const { app, BrowserWindow } = require('electron');
function create() {
  const w = new BrowserWindow({ width: 1280, height: 720, backgroundColor: '#0b0d1a', autoHideMenuBar: true, title: 'Ki Clash Z' });
  w.setMenuBarVisibility(false);
  w.loadFile('index.html');
  w.webContents.on('before-input-event', (e, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') w.setFullScreen(!w.isFullScreen());
  });
}
app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
