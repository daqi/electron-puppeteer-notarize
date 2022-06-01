const fs = require('fs')
const path = require('path')
const electron_notarize = require('electron-notarize')

module.exports = async function (params) {
    if (process.platform !== 'darwin') {
        return
    }

    const password = require('./password.json')
    const appId = process.env.ELECTRON_BUILD_APP_ID || 'ynote-desktop'

    let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`)
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`)
    }

    try {
        await electron_notarize.notarize({
            appBundleId: appId,
            appPath: appPath,
            ...password,
        })
    } catch (error) {
        console.error(error)
    }

    console.log(`Done notarizing`)
}
