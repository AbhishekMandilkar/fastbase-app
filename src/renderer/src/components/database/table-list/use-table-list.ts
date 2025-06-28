import {actionsProxy} from '@/lib/action-proxy'
import {useQuery} from '@tanstack/react-query'
import {useState, useMemo} from 'react'
import {useParams} from 'react-router'
import {TableWithColumns} from 'src/shared/types'
import {useDebounce} from '@/hooks/use-debounce'
import {useDatabase} from '@/pages/database/slice/database-slice'

export const useTableList = () => {
  const {tableName} = useParams();
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const {connectionId} = useParams();

  const query = useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(connectionId),
    queryKey: ['databaseTables', connectionId, debouncedSearch],
    queryFn: async () => {
      if (!connectionId) return null
      return actionsProxy.getDatabaseTables.invoke({ connectionId }) || []
    },
    throwOnError: true
  })


  const filteredTables = useMemo(() => {
    if (!query.data?.tables || !debouncedSearch) return query.data?.tables
    return query.data.tables.filter(table => 
      table.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [query.data?.tables, debouncedSearch]) || []

  return {
    tables: filteredTables as TableWithColumns[],
    isFreshLoading: query.isLoading,
    isCachedLoading: query.isFetching,
    selectedTable: tableName,
    setSearch
  }
}
