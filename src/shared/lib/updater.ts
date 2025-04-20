import electronUpdater, {UpdateInfo} from 'electron-updater'
// import { showUpdaterWindow, windows } from './window'
import {MenuItem, dialog, app} from 'electron'
import {showUpdaterWindow, windows} from './window'
import {is} from '@electron-toolkit/utils'

electronUpdater.autoUpdater.fullChangelog = true
electronUpdater.autoUpdater.autoDownload = false

// electronUpdater.autoUpdater.forceDevUpdateConfig = import.meta.env.DEV
const appVersion = app.getVersion()
if (import.meta.env.PROD) {
  electronUpdater.autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'AbhishekMandilkar',
    repo: 'fastbase-app'
  })
}

let updateInfo: UpdateInfo | null = null
let menuItem: MenuItem | null = null

function enableMenuItem() {
  if (menuItem) {
    menuItem.enabled = true
    menuItem = null
  }
}

export function init() {
  console.log('==========updater init==========')
  electronUpdater.autoUpdater.addListener('update-downloaded', () => {
    const window = windows.get('updater')
    if (window) {
      window.webContents.send('update-downloaded')
    }
  })

  electronUpdater.autoUpdater.addListener('update-not-available', () => {
    updateInfo = null
    enableMenuItem()
    const window = windows.get('updater')
    window?.close()
  })

  electronUpdater.autoUpdater.addListener('download-progress', (info) => {
    const window = windows.get('updater')
    if (window) {
      window.webContents.send('download-progress', info)
    }
  })
}

export function getUpdateInfo() {
  return updateInfo
}

export function getCurrentVersion() {
  return electronUpdater.autoUpdater.currentVersion?.version;
}

export async function checkForUpdatesMenuItem(_menuItem: MenuItem) {
  menuItem = _menuItem
  menuItem.enabled = false
  const updates = await electronUpdater.autoUpdater.checkForUpdates()

  enableMenuItem()

  if (
    updates?.updateInfo?.version &&
    electronUpdater.autoUpdater.currentVersion.compare(updates.updateInfo.version) < 0
  ) {
    updateInfo = updates.updateInfo
    showUpdaterWindow()
  } else {
    updateInfo = null
    await dialog.showMessageBox({
      title: 'No updates available',
      message: `You are already using the latest version of ${APP_NAME}.`
    })
  }
}

export async function checkForUpdates() {
  try {
    console.log('==========checkForUpdates==========', electronUpdater.autoUpdater.currentVersion)
    const updates = await electronUpdater.autoUpdater.checkForUpdates()
    if (
      updates?.updateInfo?.version &&
      electronUpdater.autoUpdater.currentVersion.compare(updates.updateInfo.version) < 0
    ) {
      console.log('==========checkForUpdates updates==========', updates)
      updateInfo = updates.updateInfo
      return updateInfo
    }

    updateInfo = null
    return null
  } catch (error) {
    console.error('==========checkForUpdates error==========', error)
    return null
  }
}

export function quitAndInstall() {
  electronUpdater.autoUpdater.quitAndInstall()
}

export function downloadUpdate() {
  return electronUpdater.autoUpdater.downloadUpdate()
}
