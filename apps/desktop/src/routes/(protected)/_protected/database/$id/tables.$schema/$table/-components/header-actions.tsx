import type { Database } from '~/lib/indexeddb'
import { Button } from '@fastbase/ui/components/button'
import { ContentSwitch } from '@fastbase/ui/components/custom/content-switch'
import { LoadingContent } from '@fastbase/ui/components/custom/loading-content'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@fastbase/ui/components/tooltip'

import { useInfiniteQuery } from '@tanstack/react-query'
import { databaseColumnsQuery } from '~/entities/database'
import { queryClient } from '~/main'
import { usePageContext } from '..'
import { useRowsQueryOpts } from '../-queries/use-rows-query-opts'
import { HeaderActionsColumns } from './header-actions-columns'
import { HeaderActionsDelete } from './header-actions-delete'
import { HeaderActionsFilters } from './header-actions-filters'
import {Check, RotateCcw} from 'lucide-react'

export function HeaderActions({ table, schema, database }: { table: string, schema: string, database: Database }) {
  const { store } = usePageContext()
  const rowsQueryOpts = useRowsQueryOpts()
  const { isFetching, dataUpdatedAt, refetch } = useInfiniteQuery(rowsQueryOpts)

  async function handleRefresh() {
    store.setState(state => ({
      ...state,
      page: 1,
    }))
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: databaseColumnsQuery(database, table, schema).queryKey }),
    ])
  }

  return (
    <div className="flex gap-2">
      <HeaderActionsDelete
        table={table}
        schema={schema}
        database={database}
      />
      <HeaderActionsColumns
        database={database}
        table={table}
        schema={schema}
      />
      <HeaderActionsFilters />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <LoadingContent loading={isFetching}>
                <ContentSwitch
                  activeContent={<Check className="text-success" />}
                  active={isFetching}
                >
                  <RotateCcw />
                </ContentSwitch>
              </LoadingContent>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end">
            Refresh rows
            <p className="text-xs text-muted-foreground">
              Last updated:
              {' '}
              {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'never'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
