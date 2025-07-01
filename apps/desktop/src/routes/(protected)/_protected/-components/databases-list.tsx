import type {Database} from '~/lib/indexeddb'
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from '@fastbase/ui/components/alert-dialog'
import {Button} from '@fastbase/ui/components/button'
import {LoadingContent} from '@fastbase/ui/components/custom/loading-content'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@fastbase/ui/components/dropdown-menu'
import {Skeleton} from '@fastbase/ui/components/skeleton'
import {RiDeleteBinLine, RiMoonLine, RiMoreLine} from '@remixicon/react'
import {useMutation} from '@tanstack/react-query'
import {Link, useRouter} from '@tanstack/react-router'
import {useMemo, useState} from 'react'
import {toast} from 'sonner'
import {DatabaseIcon, databasesQuery, prefetchDatabaseCore, removeDatabase, useDatabases} from '~/entities/database'
import {queryClient} from '~/main'
import {Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarContent} from '@fastbase/ui/components/sidebar'
import {Separator} from '@fastbase/ui/components/separator'
import {AppLogoSquare} from '@fastbase/ui/components/brand/app-logo-square'
import {UpdatesObserver} from '~/updates-observer'
import {AppLogo} from '@fastbase/ui/components/brand/app-logo'
import Brand from '@fastbase/ui/components/brand/brand'
import {ThemeToggle} from '~/components/theme-toggle'

function DatabaseCard({database, onRemove}: {database: Database, onRemove: () => void}) {
  const connectionString = useMemo(() => {
    const url = new URL(database.connectionString)

    if (database.isPasswordExists || url.password) {
      url.password = '*'.repeat(url.password.length || 6)
    }

    return url.toString()
  }, [database.connectionString])

  return (
    <Link
      className="relative flex items-center justify-between gap-4 rounded-lg bg-card p-5 border hover:border-primary transition-all duration-150 hover:shadow-lg shadow-black/3"
      to="/database/$id/sql"
      params={{id: database.id}}
      onMouseOver={() => prefetchDatabaseCore(database)}
    >
      <div className="size-12 shrink-0 rounded-full bg-muted/50 p-3">
        <DatabaseIcon type={database.type} className="size-full text-primary" />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="font-medium tracking-tight truncate">{database.name}</div>
        <div data-mask className="text-sm text-muted-foreground truncate">{connectionString.replaceAll('*', '•')}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md p-2 hover:bg-accent-foreground/5">
          <RiMoreLine className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.preventDefault()
              onRemove()
            }}
          >
            <RiDeleteBinLine className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  )
}

export function Empty() {

  return (
    <div className="text-center rounded-xl w-full group p-5">
        No connections found
    </div>
  )
}

function DatabaseCardSkeleton() {
  return (
    <div className="relative flex items-center justify-between gap-4 rounded-lg bg-card p-5">
      <Skeleton className="size-14 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

function RemoveDatabaseDialog({id, open, onOpenChange}: {id: string | null, open: boolean, onOpenChange: (open: boolean) => void}) {
  const {mutate: removeDatabaseMutation, isPending} = useMutation({
    mutationFn: async () => {
      if (!id)
        return

      await removeDatabase(id)
    },
    onSuccess: () => {
      toast.success('Database removed successfully')
      onOpenChange(false)
      queryClient.invalidateQueries({queryKey: databasesQuery().queryKey})
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove database</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this database
            and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault()
              removeDatabaseMutation()
            }}
            disabled={isPending}
          >
            <LoadingContent loading={isPending}>
              Remove
            </LoadingContent>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DatabasesList({sidebarProps}: {sidebarProps?: React.ComponentProps<typeof Sidebar>}) {
  const {data: databases, isPending} = useDatabases()
  const [selected, setSelected] = useState<string | null>(null)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <Sidebar {...sidebarProps}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Brand  />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              <RemoveDatabaseDialog id={selected} open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen} />
              <div className="flex flex-col gap-2">
                {isPending
                  ? (
                    <>
                      <DatabaseCardSkeleton />
                      <DatabaseCardSkeleton />
                      <DatabaseCardSkeleton />
                    </>
                  )
                  : databases?.length
                    ? databases.map(database => (
                      <DatabaseCard
                        key={database.id}
                        database={database}
                        onRemove={() => {
                          setSelected(database.id)
                          setIsRemoveDialogOpen(true)
                        }}
                      />
                    ))
                    : <Empty />}
              </div>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex flex-row justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <UpdatesObserver />
            <ThemeToggle>
              <Button variant="ghost" size="icon">
                <RiMoonLine className="size-4" />
              </Button>
            </ThemeToggle>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
