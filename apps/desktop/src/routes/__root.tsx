import { title } from '@fastbase/shared/utils/title'
import {SidebarProvider} from '@fastbase/ui/components/sidebar'
import { Toaster } from '@fastbase/ui/components/sonner'
import { ThemeProvider } from '@fastbase/ui/theme-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { AuthObserver } from '~/auth-observer'
import { ErrorPage } from '~/error-page'
import { authClient } from '~/lib/auth'
import { EventsProvider } from '~/lib/events'
import { sleep } from '~/lib/helpers'
import { queryClient } from '~/main'
import { checkForUpdates, UpdatesObserver } from '~/updates-observer'

export const Route = createRootRoute({
  component: RootDocument,
  errorComponent: ErrorPage,
  head: () => ({
    meta: [
      {
        title: title(),
      },
    ],
  }),
})

checkForUpdates()

function RootDocument() {
  const { isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending)
      return

    // Entering app animations
    const preloader = document.getElementById('preloader')
    const root = document.getElementById('root')!

    sleep(1000).then(() => {
      root.classList.remove('scale-[1.2]', 'opacity-0')
      document.body.classList.remove('overflow-hidden')
    })

    if (preloader) {
      sleep(1000).then(() => preloader.remove())
    }
  }, [isPending])

  return (
    <>
    <SidebarProvider>
      <HeadContent />
      <EventsProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <UpdatesObserver />
            <AuthObserver />
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
            <Toaster />
            {import.meta.env.DEV && (
              <>
                <TanStackRouterDevtools position="bottom-right" />
                <ReactQueryDevtools initialIsOpen={false} />
              </>
            )}
          </QueryClientProvider>
        </ThemeProvider>
      </EventsProvider>
      </SidebarProvider>
    </>
  )
}
