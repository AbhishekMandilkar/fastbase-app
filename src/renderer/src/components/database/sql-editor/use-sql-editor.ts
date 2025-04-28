import { useCallback, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { QueryDatabaseResult } from 'src/shared/types'
import { useParams } from 'react-router'
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'
import useSqlQuery from '../hooks/use-sql-query'
import {editor} from 'monaco-editor'
import useRecentQueries, {RECENT_QUERIES_QUERY_KEY} from '../recent-queries/use-recent-queries'
import {queryClient} from '@/lib/query-client'
import {NEW_QUERY_TITLE} from '../recent-queries/utils'
import {Query} from 'src/shared/schema/app-schema'
import {actionsProxy} from '@/lib/action-proxy'
const useSqlEditor = (props: {selectedQuery: Query | undefined}) => {
  const { theme } = useTheme()
  const { handleQuery, isPending } = useSqlQuery()
  const { connectionId } = useParams()
  const isDarkMode = theme === 'dark' 
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const {isLoading, handleCreateQuery} = useRecentQueries({fetchOnMount: false})
  const [code, setCode] = useState(`SELECT * FROM users`)
  const [results, setResults] = useState<QueryDatabaseResult[]>([])

  if (!connectionId) {
    throw new Error('No active connection')
  }

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (results.length === 0) return []

    return Object.keys(results[0]?.rows[0] || {}).map((key) => ({
      id: key,
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue()
    }))
  }, [results])

  const table = useReactTable({
    data: results[0]?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleRunQuery = async () => {
    const query = editorRef.current?.getValue() || ''
    if (query.length === 0) {
      return;
    }
    const resp = await handleQuery(query)
    setResults(resp || [])
    if (props.selectedQuery) {
      await actionsProxy.updateQuery.invoke({
        id: props.selectedQuery.id,
        query: query
      })
    } else {
      await handleCreateQuery({
        connectionId: connectionId as string,
        query: query,
        title: NEW_QUERY_TITLE
      })
    }
    queryClient.invalidateQueries({queryKey: [RECENT_QUERIES_QUERY_KEY, connectionId]})
  }


  return {
    code,
    isDarkMode,
    isPending,
    results,
    table,
    editorRef,
    handleRunQuery,
  }
}

export default useSqlEditor
