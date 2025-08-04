import type {Database} from '~/lib/indexeddb'
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from '@fastbase/ui/components/alert-dialog'
import {Button} from '@fastbase/ui/components/button'
import {LoadingContent} from '@fastbase/ui/components/custom/loading-content'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@fastbase/ui/components/dropdown-menu'
import {Skeleton} from '@fastbase/ui/components/skeleton'
import {useMutation} from '@tanstack/react-query'
import {Link} from '@tanstack/react-router'
import {useMemo, useState} from 'react'
import {toast} from 'sonner'
import {DatabaseIcon, databasesQuery, prefetchDatabaseCore, removeDatabase, useDatabases} from '~/entities/database'
import {queryClient} from '~/main'
import {Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroup, SidebarContent, SidebarGroupContent, SidebarGroupLabel} from '@fastbase/ui/components/sidebar'
import {Separator} from '@fastbase/ui/components/separator'
import {UpdatesObserver} from '~/updates-observer'
import Brand from '@fastbase/ui/components/brand/brand'
import {ThemeToggle} from '~/components/theme-toggle'
import {EllipsisVertical, Moon, Trash} from 'lucide-react'

function DatabaseCard({database, onRemove}: {database: Database, onRemove: () => void}) {
  const connectionString = useMemo(() => {
    const url = new URL(database.connectionString)

    if (database.isPasswordExists || url.password) {
      url.password = '*'.repeat(url.password.length || 6)
    }

    return url.toString()
  }, [database.connectionString])

  return (
    <SidebarMenuButton
      onMouseOver={() => prefetchDatabaseCore(database)}
      asChild
    >
      <Link to="/database/$id/sql" params={{id: database.id}}>
        <DatabaseIcon type={database.type} className="size-4 text-primary" />
        <div className="flex flex-1 flex-col min-w-0">
          <span className="font-medium tracking-tight truncate">{database.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <EllipsisVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.preventDefault()
                onRemove()
              }}
            >
              <Trash className="mr-2 size-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
    </SidebarMenuButton>
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
    <SidebarMenuButton>
      <Skeleton className="size-4 shrink-0 rounded-full" />
      <Skeleton className="h-4 w-2/3" />
    </SidebarMenuButton>
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
      <Sidebar {...sidebarProps}>
        <SidebarContent>
          <SidebarGroup>
          <SidebarGroupLabel>Databases</SidebarGroupLabel>
            <SidebarMenu>
              <RemoveDatabaseDialog id={selected} open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen} />
              <SidebarGroupContent>
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
              </SidebarGroupContent>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex flex-row justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <UpdatesObserver />
            <ThemeToggle>
              <Button variant="ghost" size="icon">
                <Moon className="size-4" />
              </Button>
            </ThemeToggle>
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}
