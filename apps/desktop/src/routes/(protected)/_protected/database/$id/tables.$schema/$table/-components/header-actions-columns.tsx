import type { Database } from '~/lib/indexeddb'
import { Button } from '@fastbase/ui/components/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@fastbase/ui/components/command'
import { Indicator } from '@fastbase/ui/components/custom/indicator'
import { Popover, PopoverContent, PopoverTrigger } from '@fastbase/ui/components/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@fastbase/ui/components/tooltip'
import { useStore } from '@tanstack/react-store'
import { usePageContext } from '..'
import { useColumnsQuery } from '../-queries/use-columns-query'
import {Check, Columns2, DatabaseIcon} from 'lucide-react'

export function HeaderActionsColumns({ database, table, schema }: { database: Database, table: string, schema: string }) {
  const { store } = usePageContext()
  const hiddenColumns = useStore(store, state => state.hiddenColumns)
  const { data: columns } = useColumnsQuery(database, table, schema)

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <div className="relative">
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button size="icon" variant="outline">
                  <Columns2 />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            {hiddenColumns.length > 0 && <Indicator />}
          </div>
          <TooltipContent side="top">
            Columns visibility
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="p-0 w-2xs" side="bottom" align="end">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandList className="h-fit max-h-[70vh]">
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="toggle-columns"
                onSelect={() => store.setState(state => ({
                  ...state,
                  hiddenColumns: (hiddenColumns.length === 0 && columns?.map(col => col.name)) || [],
                }))}
              >
                <span className="size-4">
                  {hiddenColumns.length === 0 && <Check className="size-4 opacity-50" />}
                </span>
                <Columns2 className="size-4 opacity-50" />
                <span>{hiddenColumns.length === 0 ? 'Hide all columns' : 'Show all columns'}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {columns?.map(column => (
                <CommandItem
                  key={column.name}
                  value={column.name}
                  keywords={[column.name, column.type]}
                  onSelect={() => store.setState(state => ({
                    ...state,
                    hiddenColumns: hiddenColumns.includes(column.name)
                      ? hiddenColumns.filter(name => name !== column.name)
                      : [...hiddenColumns, column.name],
                  }))}
                >
                  <span className="size-4 shrink-0">
                    {!hiddenColumns.includes(column.name) && <Check className="size-4 opacity-50" />}
                  </span>
                  <DatabaseIcon className="size-4 opacity-50 shrink-0" />
                  <span className="truncate">{column.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
