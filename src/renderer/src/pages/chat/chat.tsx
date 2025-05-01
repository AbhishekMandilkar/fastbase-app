import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from '@/components/prompt-input'
import { Button } from '@/components/ui/button'
import { ArrowUp, Loader2, Square } from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'
import useDatabaseStructure from './useDatabaseStructure'
import {formatForeignKeysForPrompt, formatSchemaForPrompt, systemPrompt} from './utils'
import {api} from '@/lib/axios'
import useSqlQuery from '@/components/database/hooks/use-sql-query'
import {ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table'
import {DataTable} from '@/components/database/table-explorer/data-table/data-table'
import {TypingAnimation} from '@/components/typing-animation'
import DataTableV2 from '@/components/database/table-explorer/data-table/data-table-v2'

const ChatView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    data: databaseStructure,
    isLoading: isDatabaseStructureLoading,
    isError: isDatabaseStructureError
  } = useDatabaseStructure()
  const [input, setInput] = useState('')
  const {handleQuery} = useSqlQuery()
  const [results, setResults] = useState<any[]>([])
  const handleSubmit = async () => {
    setIsLoading(true)
    const databaseStructurePrompt = formatSchemaForPrompt(databaseStructure?.tableStructure?.map(table => table.rows)?.[0] || [])
    const foreignKeysPrompt = formatForeignKeysForPrompt(databaseStructure?.foreignKeys?.map(foreignKey => foreignKey.rows)?.[0] || [])
    const prompt = systemPrompt({
      schema: databaseStructurePrompt + "\n" + foreignKeysPrompt
    })
    const response = await api.post('/chat', {
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: `Generate the query necessary to retrieve the data the user wants: ${input}`
        }
      ]
    })
    const result = await handleQuery(response.data.query)
    setResults(result)
    setIsLoading(false)
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
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex-1 flex flex-col gap-4 justify-center items-center">
      <TypingAnimation text="What do you want to know from your data?" duration={50} className="font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm" />
      {isDatabaseStructureLoading ? (
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <PromptInput className="w-full max-w-[450px] bg-primary-foreground">
          <PromptInputTextarea
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className=''
          />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction tooltip={isLoading ? 'Stop generation' : 'Send message'}>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <Square className="size-5 fill-current animate-spin" />
                ) : (
                  <ArrowUp className="size-5 " />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      )}
      <div className='container-sm'>
        {results.length > 0 && <DataTableV2 table={table} containerClassName='border p-2' tableClassName='border rounded-md' />}
      </div>
    </div>
  )
}

export default ChatView
