import { useState, useMemo, useCallback } from 'react'
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import useDatabaseStructure from '../useDatabaseStructure'
import useSqlQuery from '@/components/database/hooks/use-sql-query'
import { formatForeignKeysForPrompt, formatSchemaForPrompt, systemPrompt } from '../utils'
import { api } from '@/lib/axios'
import { actionsProxy } from '@/lib/action-proxy'
import { toast } from 'sonner'

type DataRecord = Record<string, unknown>

interface ChatQueryResult {
  error?: string;
  rows?: DataRecord[];
}

interface UseChatQueryReturn {
  // States
  isLoading: boolean
  isDatabaseStructureLoading: boolean
  isSQLGenerated: boolean
  input: string
  query: string
  
  // Computed values
  dataResults: DataRecord[]
  error?: string
  table: ReturnType<typeof useReactTable<DataRecord>>
  hasResults: boolean
  
  // Methods
  handleInputChange: (value: string) => void
  handleSubmit: () => Promise<void>
  copyQueryToClipboard: () => void
  copyResponseToClipboard: () => void
}

export function useChatQuery(): UseChatQueryReturn {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')
  const [results, setResults] = useState<ChatQueryResult[]>([])
  const [isSQLGenerated, setIsSQLGenerated] = useState(false)

  // External hooks
  const { data: databaseStructure, isLoading: isDatabaseStructureLoading } = useDatabaseStructure()
  const { handleQuery } = useSqlQuery()

  // Computed values
  const dataResults = useMemo(() => results[0]?.rows || [], [results])
  const error = useMemo(() => results[0]?.error, [results])
  
  const columns = useMemo<ColumnDef<DataRecord>[]>(() => {
    if (dataResults.length === 0) return []

    return Object.keys(dataResults[0] || {}).map((key) => ({
      id: key,
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue()
    }))
  }, [dataResults])

  const table = useReactTable({
    data: dataResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  // Handlers
  const handleInputChange = useCallback((value: string) => {
    setInput(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return

    setQuery('')
    setResults([])
    setIsSQLGenerated(false)
    setIsLoading(true)

    try {
      const databaseStructurePrompt = formatSchemaForPrompt(
        databaseStructure?.tableStructure?.map((table) => table.rows)?.[0] || []
      )
      const foreignKeysPrompt = formatForeignKeysForPrompt(
        databaseStructure?.foreignKeys?.map((foreignKey) => foreignKey.rows)?.[0] || []
      )
      const promptContent = systemPrompt({
        schema: databaseStructurePrompt + '\n' + foreignKeysPrompt
      })

      const response = await api.post('/chat', {
        messages: [
          {
            role: 'system',
            content: promptContent
          },
          {
            role: 'user',
            content: `Generate the query necessary to retrieve the data the user wants: ${input}`
          }
        ]
      })

      setQuery(response.data.query)
      setIsSQLGenerated(true)

      if (response.data.query) {
        const result = await handleQuery(response.data.query)
        setResults(result)
      } else {
        setResults([{ rows: [] }])
        toast.info('Could not generate a query for your request.')
      }
    } catch (error) {
      console.error('Error during chat submission:', error)
      toast.error('An error occurred. Please try again.')
      setResults([{ error: 'An error occurred while processing your request.', rows: [] }])
    } finally {
      setIsLoading(false)
    }
  }, [input, databaseStructure, handleQuery])

  const copyQueryToClipboard = useCallback(() => {
    if (!query) return
    actionsProxy.copyToClipboard.invoke({ text: query })
    toast.success('Query copied to clipboard')
  }, [query])

  const copyResponseToClipboard = useCallback(() => {
    if (dataResults.length === 0) return
    const responseJSON = JSON.stringify(dataResults, null, 2)
    actionsProxy.copyToClipboard.invoke({ text: responseJSON })
    toast.success('Response copied to clipboard')
  }, [dataResults])

  return {
    // States
    isLoading,
    isDatabaseStructureLoading,
    isSQLGenerated,
    input,
    query,
    
    // Computed values
    dataResults,
    error,
    table,
    hasResults: dataResults.length > 0,
    
    // Methods
    handleInputChange,
    handleSubmit,
    copyQueryToClipboard,
    copyResponseToClipboard
  }
} 