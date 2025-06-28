import {actionsProxy} from '@/lib/action-proxy';
import {useDatabase} from '@/pages/database/slice/database-slice';
import {useMutation, useQuery} from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, type ColumnDef, flexRender, getPaginationRowModel } from "@tanstack/react-table"
import {useCallback, useMemo, useState} from 'react'
import {useParams} from 'react-router'
import useSqlQuery from '../hooks/use-sql-query';

interface TableData {
  [key: string]: any
}

const useTableExplorer = () => {
    const { tableName } = useParams()
    const { selectedSchema, selectedTableConfig } = useDatabase()
    const {connectionId} = useParams();
    const [whereClause, setWhereClause] = useState('')
    const [activeFilterCount, setActiveFilterCount] = useState(0)
    const [pagination, setPagination] = useState({
      pageSize: 20,
      pageIndex: 0
    })
    if (!connectionId) {
        throw new Error('No connection found')
    }

    const { mutateAsync: queryDatabase } = useMutation({
      mutationFn: (input: { connectionId: string; query: string }) => actionsProxy.queryDatabase.invoke(input)
    })

    const {handleQuery } = useSqlQuery();
   
    const {data: totalRows, isPending, isFetching: isTotalRowsFetching} = useQuery({
      queryKey: ['total-rows', tableName, selectedSchema, whereClause],
      queryFn: () => handleQuery(`SELECT COUNT(*) FROM "${selectedSchema}"."${tableName}" ${whereClause ? ' ' + whereClause : ''}`)
    })

    const fetchTableData = async () => {
      try {
        const query = `SELECT * FROM "${selectedSchema}"."${tableName}"${whereClause ? ' ' + whereClause : ''} LIMIT ${pagination.pageSize} OFFSET ${pagination.pageIndex}`

        const res = await queryDatabase({
          connectionId: connectionId,
          query
        })
      return res
      } catch (error) {
        console.error('Error fetching table data:', error)
        return []
      }
    }

    const { refetch, isFetching, data:tableData } = useQuery({
      queryKey: ['table-data', tableName, whereClause, pagination.pageIndex, pagination.pageSize],
      queryFn: fetchTableData,
      enabled: Boolean(tableName && selectedSchema),
      throwOnError(error) {
        console.error('Error fetching table data:', error)
        return false
      },
    })
    const data = tableData?.[0]?.rows || []

  
    const totalRowsCount = totalRows?.[0]?.rows[0]?.count as string;

    console.log(pagination)

    // Generate columns based on the first row of data
    const columns = useMemo<ColumnDef<TableData>[]>(() => {
      if (data.length === 0) return []
      
      return Object.keys(data[0]).map((key) => ({
        id: key,
        accessorKey: key,
        header: key,
        cell: (info) => info.getValue(),
        size: 150, // Default column size
        minSize: 100, // Minimum column size
        maxSize: 1000, // Maximum column size
      }))
    }, [data])

    // Table configuration
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: {
        pagination: {
          pageSize: pagination.pageSize,
          pageIndex: pagination.pageIndex
        }
      },
      onPaginationChange: setPagination,
      manualPagination: true,
      pageCount: Math.ceil(Number(totalRowsCount) / pagination.pageSize),
      columnResizeMode: 'onChange',
      enableColumnResizing: true
    })

    // Use React Query for data fetching

    const applyFilter = (sqlWhereClause: string) => {
      setWhereClause(sqlWhereClause)
      refetch()
    }
    const columnsList = useMemo(() => {
      return Array.from(selectedTableConfig.keys())
    }, [selectedTableConfig])

    const handleActiveFilterCountChange = (count: number) => {
      setActiveFilterCount(count)
    }

    const handlePaginationStateChange = useCallback((pageIndex: number, pageSize: number) => {
      setPagination({
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      refetch()
    }, [refetch])

    return {
      table,
      tableName,
      data,
      isLoading: isFetching || isPending,
      refetch,
      columnsList,
      applyFilter,
      activeFilterCount,
      handleActiveFilterCountChange,
      handlePaginationStateChange,
      pagination,
      totalRowsCount,
      isTotalRowsFetching
    }
}

export default useTableExplorer