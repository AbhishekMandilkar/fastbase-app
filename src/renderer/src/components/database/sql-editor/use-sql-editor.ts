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

const useSqlEditor = () => {
  const { theme } = useTheme()
  const { handleQuery, isPending } = useSqlQuery()
  const { connectionId } = useParams()
  const isDarkMode = theme === 'dark' 
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
    const resp = await handleQuery(editorRef.current?.getValue() || '')
    console.info(resp)
    setResults(resp)
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
