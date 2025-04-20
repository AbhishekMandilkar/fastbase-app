import { BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export type WindowId = 'main' | 'updater'

export const windows = new Map<WindowId, BrowserWindow>()

export function createWindow({
  id,
  path: urlPath,
  windowOptions
}: {
  id: WindowId
  path?: string
  windowOptions?: BrowserWindowConstructorOptions
}) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    titleBarStyle: 'default',
    // expose window controlls in Windows/Linux
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  })
  windows.set(id, mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
   
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

export const createMainWindow = () => {
  const window = windows.get('main')

  if (window) {
    window.show()
    return window
  }

  return createWindow({
    id: 'main',
    windowOptions: {
      minWidth: 800,
      minHeight: 600,
      trafficLightPosition: { x: 12, y: 16 }
    }
  })
}

export function showUpdaterWindow() {
  let window = windows.get('updater')

  if (!window) {
    window = createWindow({
      id: 'updater',
      path: '/updater',
      windowOptions: {
        width: 700,
        height: 500,
        resizable: false
        // vibrancy: "sidebar",
        // visualEffectState: "active",
      }
    })
  } else {
    window.show()
  }

  return window
}
