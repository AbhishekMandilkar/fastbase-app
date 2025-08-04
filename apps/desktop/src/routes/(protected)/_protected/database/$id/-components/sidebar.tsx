import type {Database} from '~/lib/indexeddb'
import {Button} from '@fastbase/ui/components/button'
import {Sidebar, SidebarContent, SidebarGroupContent, SidebarHeader} from '@fastbase/ui/components/sidebar'
import {CardTitle} from '@fastbase/ui/components/card'
import {ContentSwitch} from '@fastbase/ui/components/custom/content-switch'
import {LoadingContent} from '@fastbase/ui/components/custom/loading-content'
import {Input} from '@fastbase/ui/components/input'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@fastbase/ui/components/tooltip'
import {useSessionStorage} from '@fastbase/ui/hookas/use-session-storage'
import {useDatabaseTablesAndSchemas} from '~/entities/database'
import {TablesTree} from './tables-tree'
import {Check, RotateCcw, X} from 'lucide-react'

export function TablesSidebar({database}: {database: Database}) {
  const {data: tablesAndSchemas, refetch: refetchTablesAndSchemas, isFetching: isRefreshingTablesAndSchemas, dataUpdatedAt} = useDatabaseTablesAndSchemas(database)
  const [search, setSearch] = useSessionStorage(`database-tables-search-${database.id}`, '')

  const renderRefreshButton = () => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetchTablesAndSchemas()}
            >
              <LoadingContent loading={isRefreshingTablesAndSchemas}>
                <ContentSwitch
                  activeContent={<Check className="text-success" />}
                  active={!isRefreshingTablesAndSchemas}
                >
                  <RotateCcw />
                </ContentSwitch>
              </LoadingContent>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            Refresh tables and schemas list
            <p className="text-xs text-muted-foreground">
              Last updated:
              {' '}
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'never'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <Sidebar collapsible="none">
    <SidebarHeader className="gap-3.5 border-b p-4">
      <div className="flex w-full items-center justify-between">
        <div className="text-base font-medium text-foreground">Tables</div>
        {renderRefreshButton()}
      </div>
      <div className="relative">
        <Input
          placeholder="Search tables"
          className="pr-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1"
            onClick={() => setSearch('')}
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroupContent>
        <TablesTree
          className="flex-1"
          database={database}
          search={search}
        />
      </SidebarGroupContent>
    </SidebarContent>
  </Sidebar>


}
