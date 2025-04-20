import { ProgressInfo } from 'electron-updater'
import { useEffect, useState } from 'react'
import prettyBytes from 'pretty-bytes'
import { Button } from '@renderer/components/ui/button'
import { actionsProxy } from '@renderer/lib/action-proxy'
import { useQuery } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog"

export function UpdaterView() {
  const updateInfoQuery = useQuery({
    queryKey: ['updateInfo'],
    queryFn: () => actionsProxy.getUpdateInfo.invoke()
  });

  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null)
  const [status, setStatus] = useState<null | 'downloading' | 'downloaded'>(null)

  const updateInfo = updateInfoQuery.data;

  useEffect(() => {
    const unlisten = window.electron.ipcRenderer.on(
      'download-progress',
      (_, info: ProgressInfo) => {
        setProgressInfo(info)
      }
    )

    return unlisten
  }, [])

  useEffect(() => {
    const unlisten = window.electron.ipcRenderer.on('update-downloaded', () => {
      setStatus('downloaded')
    })

    return unlisten
  }, [])

  if (!updateInfo) return null

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === 'downloaded'
              ? `New version of ${APP_NAME} is ready to install`
              : status === 'downloading'
              ? `Downloading ${APP_NAME}...`
              : `New version of ${APP_NAME} is available`}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {status ? (
              <>
                {progressInfo && status === 'downloading' && (
                  <div className="text-right">
                    <span>{prettyBytes(progressInfo.bytesPerSecond)}/s</span>
                  </div>
                )}
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${status === 'downloaded' ? 100 : progressInfo?.percent || 0}%`
                    }}
                  ></div>
                </div>
              </>
            ) : (
              <p>
                {APP_NAME} {updateInfo?.version} is now available — you have {APP_VERSION}.
                Would you like to update now?
              </p>
            )}

            {Array.isArray(updateInfo?.releaseNotes) && (
              <div className="mt-4 max-h-[200px] overflow-auto">
                {updateInfo.releaseNotes.map((note: any) => (
                  <div key={note.version} className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold">v{note.version}</h3>
                    <div
                      className="prose prose-sm prose-invert"
                      dangerouslySetInnerHTML={{ __html: note.note }}
                    />
                  </div>
                ))}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              actionsProxy.closeWindow.invoke({ id: 'updater' })
            }}
          >
            Cancel
          </AlertDialogCancel>
          {status === 'downloaded' ? (
            <AlertDialogAction
              onClick={() => {
                actionsProxy.quitAndInstall.invoke()
              }}
            >
              Install Update
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              disabled={status === 'downloading'}
              onClick={() => {
                setStatus('downloading')
                actionsProxy.downloadUpdate.invoke()
              }}
            >
              Download Update
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
