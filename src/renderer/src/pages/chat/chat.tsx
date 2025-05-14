import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from '@/components/prompt-input'
import { Button } from '@/components/ui/button'
import { ArrowUp, CopyIcon, Loader2, Square } from 'lucide-react'
import React, { useMemo, useRef, useState } from 'react'
import useDatabaseStructure from './useDatabaseStructure'
import { formatForeignKeysForPrompt, formatSchemaForPrompt, systemPrompt } from './utils'
import { api } from '@/lib/axios'
import useSqlQuery from '@/components/database/hooks/use-sql-query'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { DataTable } from '@/components/database/table-explorer/data-table/data-table'
import { TypingAnimation } from '@/components/typing-animation'
import DataTableV2 from '@/components/database/table-explorer/data-table/data-table-v2'
import CodeBlock from './code-block'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { actionsProxy } from '@/lib/action-proxy'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const ChatView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeBlockVisible, setIsCodeBlockVisible] = useState(false)
  const [query, setQuery] = useState('')
  const {
    data: databaseStructure,
    isLoading: isDatabaseStructureLoading,
    isError: isDatabaseStructureError
  } = useDatabaseStructure()
  const [input, setInput] = useState('')
  const { handleQuery } = useSqlQuery()
  const [results, setResults] = useState<any[]>([])
  const [isSQLGenerated, setIsSQLGenerated] = useState(false)
  const handleSubmit = async () => {
    setQuery('')
    setIsLoading(true)
    const databaseStructurePrompt = formatSchemaForPrompt(
      databaseStructure?.tableStructure?.map((table) => table.rows)?.[0] || []
    )
    const foreignKeysPrompt = formatForeignKeysForPrompt(
      databaseStructure?.foreignKeys?.map((foreignKey) => foreignKey.rows)?.[0] || []
    )
    const prompt = systemPrompt({
      schema: databaseStructurePrompt + '\n' + foreignKeysPrompt
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
    setQuery(response.data.query)
    setIsSQLGenerated(true)
    const result = await handleQuery(response.data.query)
    setResults(result)
    setIsLoading(false)
  }
  const dataResults = results[0]?.rows || []
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (dataResults.length === 0) return []

    return Object.keys(results[0]?.rows[0] || {}).map((key) => ({
      id: key,
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue()
    }))
  }, [results])

  const table = useReactTable({
    data: dataResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const onClickCopy = () => {
    actionsProxy.copyToClipboard.invoke({ text: query })
    toast.success('Copied to clipboard')
  }

  const renderShowQuery = (btnClassName?: string) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className={cn('underline', btnClassName)}>
            Show Query
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[3xl]">
          <div className="grid gap-4 py-4">
            <CodeBlock code={query} />
          </div>
          <DialogFooter>
            <Button type="submit" size={'icon'} onClick={onClickCopy}>
              <CopyIcon className="size-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const renderNoResults = () => {
    return (
      <div className="flex-1 flex flex-col gap-4 justify-center items-center font-mono">
        <h3>
          The query ran successfully — but there’s no matching data.
          {renderShowQuery()}
        </h3>
      </div>
    )
  }

  const onClickCopyResponse = () => {
    const responseJSON = JSON.stringify(results[0]?.rows, null, 2)
    actionsProxy.copyToClipboard.invoke({ text: responseJSON })
    toast.success('Copied to clipboard')
  }

  const renderActionBar = () => {
    if (dataResults.length === 0) return null
    return (
      <div className="flex justify-end items-center w-full text-xs text-muted-foreground">
        {renderShowQuery('text-muted-foreground')}
        <Separator orientation="vertical" className="h-4" />
        <Button
          variant="link"
          className="underline text-muted-foreground"
          onClick={onClickCopyResponse}
        >
          Copy response
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-4 justify-center items-center min-w-[calc(100vw-3rem)]">
      <TypingAnimation
        text="What do you want to know from your data?"
        duration={50}
        className="font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm"
      />
      {isDatabaseStructureLoading ? (
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      ) : (
        <div className="max-w-[500px] w-full space-y-1">
          <PromptInput className="w-full bg-primary-foreground">
            <PromptInputTextarea
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className=""
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
          {renderActionBar()}
        </div>
      )}

      {isSQLGenerated && (
        <div className="container-sm">
          {dataResults.length > 0 ? (
            <DataTableV2
              table={table}
              containerClassName="border p-2"
              tableClassName="border rounded-md"
            />
          ) : (
            renderNoResults()
          )}
        </div>
      )}
    </div>
  )
}

export default ChatView
