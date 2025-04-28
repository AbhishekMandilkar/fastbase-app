import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query'
import { queryClient } from './query-client'
import { ActionsProxy } from 'src/shared/lib/actions.d'

export const actionsProxy = new Proxy<ActionsProxy>({} as any, {
  get: (_, prop) => {
    const invoke = async (input: any) => {
      const res = await window.electron.ipcRenderer.invoke(prop.toString(), input)
      console.log('invoke', prop.toString(), input, JSON.stringify(res, null, 2))
      return res
    }
    return {
      invoke
    }
  }
})
