import {
    Menu,
    MessageBoxOptions,
    OpenDialogOptions,
    SaveDialogOptions,
    clipboard,
    dialog
  } from 'electron'
  import { loadConfig, saveConfig } from './config'
  import { Config, Query } from '../types'
  import { connectDatabase, disconnectDatabase, getDatabaseSchemas, getDatabaseTables, queryDatabase } from './connection'
  import { appDB, appSchema } from './app-db'
  import { desc, eq } from 'drizzle-orm'
  import { checkForUpdates, downloadUpdate, getCurrentVersion, getUpdateInfo, quitAndInstall } from './updater'
import {showUpdaterWindow, WindowId, windows} from './window'
import {Connection, ConnectionInsert, QueryInsert} from '../schema/app-schema'

  
  type ActionContext = {
    sender: Electron.WebContents
  }
  
  type ActionFunction<TInput, TResult> = (args: {
    context: ActionContext
    input: TInput
  }) => Promise<TResult>
  
  const createChainFns = <TInput>() => {
    return {
      action: <TResult>(action: ActionFunction<TInput, TResult>) => {
        return (context: ActionContext, input: TInput) => action({ context, input })
      }
    }
  }
  
  const createChain = () => {
    return {
      input<TInput>() {
        return createChainFns<TInput>()
      },
  
      ...createChainFns<void>()
    }
  }
  
  const chain = createChain()
  
  export const actions = {
    getUpdateInfo: chain.action(async () => {
      return getUpdateInfo()
    }),

    getCurrentVersion: chain.action(async () => {
      return getCurrentVersion()
    }),
  
    checkForUpdates: chain.action(async () => {
      return checkForUpdates()
    }),
  
    downloadUpdate: chain.action(async () => {
      return downloadUpdate()
    }),
  
    quitAndInstall: chain.action(async () => {
      return quitAndInstall()
    }),
  
    closeWindow: chain.input<{ id: WindowId }>().action(async ({ input }) => {
      windows.get(input.id)?.close()
    }),
  
    showUpdaterWindow: chain.action(async () => {
      showUpdaterWindow()
    }),
  
    inspectElement: chain.input<{ x: number; y: number }>().action(async ({ input, context }) => {
      context.sender.inspectElement(input.x, input.y)
    }),
  
    showContextMenu: chain
      .input<{ items: Array<{ type: 'text'; label: string } | { type: 'separator' }> }>()
      .action(async ({ input, context }) => {
        const menu = Menu.buildFromTemplate(
          input.items.map((item, index) => {
            if (item.type === 'separator') {
              return {
                type: 'separator' as const
              }
            }
            return {
              label: item.label,
              click() {
                context.sender.send('menu-click', index)
              }
            }
          })
        )
  
        menu.popup({
          callback: () => {
            context.sender.send('menu-closed')
          }
        })
      }),
  
    loadConfig: chain.action(() => {
      return loadConfig()
    }),
  
    saveConfig: chain.input<{ config: Config }>().action(({ input }) => {
      return saveConfig(input.config)
    }),
  
    showOpenDialog: chain.input<{ options: OpenDialogOptions }>().action(async ({ input }) => {
      const result = await dialog.showOpenDialog(input.options)
      return result.filePaths
    }),
  
    showSaveDialog: chain.input<{ options: SaveDialogOptions }>().action(async ({ input }) => {
      const result = await dialog.showSaveDialog(input.options)
      return result.filePath
    }),
  
    showConfirmDialog: chain
      .input<{ title: string; message: string; options?: MessageBoxOptions }>()
      .action(async ({ input }) => {
        const result = await dialog.showMessageBox({
          title: input.title,
          message: input.message,
          buttons: ['Yes', 'No'],
          ...input.options
        })
        return result.response === 0
      }),
  
    connectDatabase: chain.input<{ connectionId: string }>().action(async ({ input }) => {
      return connectDatabase(input.connectionId)
    }),

    disconnectDatabase: chain.input<{ connectionId: string }>().action(async ({ input }) => {
      return disconnectDatabase(input.connectionId)
    }),
  
    queryDatabase: chain.input<Parameters<typeof queryDatabase>[0]>().action(async ({ input }) => {
      try {
        return queryDatabase(input)
      } catch (error) {
        console.error('Error querying database:', error)
        return []
      }
    }),
  
    getDatabaseTables: chain
      .input<Parameters<typeof getDatabaseTables>[0]>()
      .action(async ({ input }) => {
        return getDatabaseTables(input)
      }),

    getDatabaseSchemas: chain.input<Parameters<typeof getDatabaseSchemas>[0]>().action(async ({ input }) => {
      return getDatabaseSchemas(input)
    }),
  
    getConnections: chain.action(async () => {
      return appDB.query.connection.findMany({
        orderBy: desc(appSchema.connection.createdAt)
      })
    }),
  
    updateConnection: chain
      .input<Partial<Connection> & { id: string }>()
      .action(async ({ input }) => {
        await disconnectDatabase(input.id)
  
        await appDB
          .update(appSchema.connection)
          .set(input)
          .where(eq(appSchema.connection.id, input.id))
  
        return input
      }),
  
    deleteConnection: chain.input<Connection['id']>().action(async ({ input }) => {
      await disconnectDatabase(input)
  
      await appDB.delete(appSchema.connection).where(eq(appSchema.connection.id, input))
    }),
  
    createConnection: chain.input<ConnectionInsert>().action(async ({ input }) => {
      await appDB.insert(appSchema.connection).values(input)
      return input
    }),
  
    getQueries: chain.input<{ connectionId: string }>().action(async ({ input }) => {
      return appDB.query.query.findMany({
        orderBy: desc(appSchema.query.createdAt),
        where: eq(appSchema.query.connectionId, input.connectionId)
      })
    }),
  
    updateQuery: chain.input<Partial<Query> & { id: string }>().action(async ({ input }) => {
      await appDB.update(appSchema.query).set(input).where(eq(appSchema.query.id, input.id))
    }),

    getQuery: chain.input<{ id: string }>().action(async ({ input }) => {
      return appDB.query.query.findFirst({
        where: eq(appSchema.query.id, input.id)
      })
    }),
  
    deleteQuery: chain.input<{ id: string }>().action(async ({ input }) => {
      await appDB.delete(appSchema.query).where(eq(appSchema.query.id, input.id))
    }),
  
    createQuery: chain.input<QueryInsert>().action(async ({ input }) => {
      await appDB.insert(appSchema.query).values(input)
    }),
  
    copyToClipboard: chain.input<{ text: string }>().action(async ({ input }) => {
      clipboard.writeText(input.text)
    })

    
  }
  