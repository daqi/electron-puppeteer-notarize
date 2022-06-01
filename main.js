const { app, BrowserWindow, shell } = require('electron')
const asar = require('asar')
const { join } = require('path')
const { access, mkdir } = require('fs/promises')
const puppeteer = require('puppeteer-core')

const chromiumZipPath = join(process.resourcesPath, '.local-chromium.asar');
const chromiumPath = join(process.resourcesPath, '.local-chromium');
const executablePath = join(chromiumPath, '/Contents/MacOS/Chromium');

console.log('chromiumZipPath', chromiumZipPath);
console.log('chromiumPath', chromiumPath);
console.log('executablePath', executablePath);
asar.extractAll(chromiumZipPath, chromiumPath);

let mainWindow

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    console.log('loadFile')
    mainWindow.loadFile('index.html');

    console.log('chromium')
    const chromium = await puppeteer.launch({ headless: true, executablePath });

    console.log('page')
    const page = await chromium.newPage();

    console.log('goto')
    await page.goto('https://www.baidu.com');

    console.log('screenshot')
    const screenshotPath = join(app.getPath('appData'), app.name, 'screenshot');
    console.log('screenshotPath', screenshotPath)
    try {
        await access(screenshotPath)
    } catch (e) {
        await mkdir(screenshotPath);
    }
    const path = join(screenshotPath, 'baidu.png')
    await page.screenshot({ path });
    console.log('screenshotRes', path);

    shell.showItemInFolder(path);

    mainWindow.on('closed', function () {
        mainWindow = null
    });

});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit();
})
