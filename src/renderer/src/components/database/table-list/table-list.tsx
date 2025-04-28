import React, {useCallback} from 'react'
import { Link } from 'react-router'
import { useTableList } from './use-table-list'
import SidebarListing from '@/components/ui/sidebar-listing'
import {ColumnTypeNameMap, TableWithColumns} from 'src/shared/types'
import {Columns4Icon} from 'lucide-react'
import {useDatabaseDispatch} from '@/pages/database/slice/database-slice'

function TableList() {
  const { tables, isFreshLoading, selectedTable, setSearch, isCachedLoading } = useTableList()

  const {handleSetSelectedTableConfig} = useDatabaseDispatch();

  // maintain a map of column name to column type
  const handleSelectTable = useCallback(
    (table: TableWithColumns) => {
      const columnTypeNameMap: ColumnTypeNameMap = new Map(
        table.columns.map((column) => {
          return [column.name, column]
        })
      )
      handleSetSelectedTableConfig(columnTypeNameMap)
    },
    [handleSetSelectedTableConfig]
  )

  const renderTableItem = ({item}: {item: TableWithColumns}) => (
    <Link
      to={item.name}
      className="flex items-center justify-between w-full"
      onClick={() => handleSelectTable(item)}
    >
      <span>{item.name}</span>
      <span className="flex items-center gap-2">
        <Columns4Icon className="size-4" />
        {item.columns.length}
      </span>
    </Link>
  )

  return (
    <SidebarListing
      title="Tables"
      items={tables}
      isLoading={isFreshLoading}
      selectedItem={selectedTable}
      renderItem={renderTableItem}
      onSearch={setSearch}
    />
  )
}

export default TableList
