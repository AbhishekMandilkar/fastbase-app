import AppHeader from '@/components/app-header'
import useTableExplorer from './use-table-explorer'
import {DataTable} from './data-table/data-table'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {ChevronRight, DatabaseIcon, InfoIcon, LayersIcon, Loader2, Rows3Icon, Table, TableIcon} from 'lucide-react'
import TableActionView from './table-actions/table-right-action-view'
import {Skeleton} from '@/components/ui/skeleton'
import {useState} from 'react'
import {Button} from '@/components/ui/button'
import TableSchema from './table-schema'
import DataTableV2 from './data-table/data-table-v2'

enum tabs {
  rows = 'rows',
  structure = 'structure'
}

const TableExplorer = () => {
  const { table, tableName, data, isLoading } = useTableExplorer()
  const isEmpty = data.length === 0
  const [selectedTab, setSelectedTab] = useState(tabs.rows)

  const SwitchIcon = selectedTab === tabs.rows ? LayersIcon : DatabaseIcon;

  const ViewMap = {
    [tabs.rows]: <DataTableV2 table={table} />,
    [tabs.structure]: <TableSchema />
  }

  return (
    <div className="flex flex-col flex-1 self-stretch !w-[calc(100vw-18rem)] overflow-hidden">
      <AppHeader
        title={
          <div className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            <span className="font-mono">{tableName}</span>
          </div>
        }
        titleClassName="font-mono"
        right={
          <TableActionView
            actionsItems={
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedTab(selectedTab === tabs.rows ? tabs.structure : tabs.rows)
                }
              >
                <SwitchIcon className="h-4 w-4" />
              </Button>
            }
          />
        }
      />
      {(() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center h-full">
             <Loader2 className="size-10 animate-spin" />
            </div>
          )
        }

        if (isEmpty && !isLoading) {
          return (
            <div className="flex items-center justify-center mx-auto w-1/2">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>No data found</AlertTitle>
                <AlertDescription>The table is empty.</AlertDescription>
              </Alert>
            </div>
          )
        }
        return ViewMap[selectedTab];
      })()}
    </div>
  )
}

export default TableExplorer
