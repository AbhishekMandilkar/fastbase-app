import {UpdateInfo, autoUpdater} from 'electron-updater'
import { showUpdaterWindow, windows } from './window'
import {MenuItem, dialog, app} from 'electron'
import {is} from '@electron-toolkit/utils'

autoUpdater.fullChangelog = true
autoUpdater.autoDownload = false

const appVersion = app.getVersion()
const server = "https://fasbase-release-server.vercel.app/";
const url = `${server}/update/${process.platform}/${appVersion}`

if (import.meta.env.PROD) {
  autoUpdater.setFeedURL(url)
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
  autoUpdater.addListener('update-downloaded', () => {
    const window = windows.get('updater')
    if (window) {
      window.webContents.send('update-downloaded')
    }
  })

  autoUpdater.addListener('update-not-available', () => {
    updateInfo = null
    enableMenuItem()
    const window = windows.get('updater')
    window?.close()
  })

  autoUpdater.addListener('download-progress', (info) => {
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
  return autoUpdater.currentVersion?.version;
}

export async function checkForUpdatesMenuItem(_menuItem: MenuItem) {
  menuItem = _menuItem
  menuItem.enabled = false
  const updates = await autoUpdater.checkForUpdates()

  enableMenuItem()

  if (
    updates?.updateInfo?.version &&
    autoUpdater.currentVersion.compare(updates.updateInfo.version) < 0
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
    console.log('==========checkForUpdates==========', autoUpdater.currentVersion)
    const updates = await autoUpdater.checkForUpdates()
    if (
      updates?.updateInfo?.version &&
      autoUpdater.currentVersion.compare(updates.updateInfo.version) < 0
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
  autoUpdater.quitAndInstall()
}

export function downloadUpdate() {
  return autoUpdater.downloadUpdate()
}
