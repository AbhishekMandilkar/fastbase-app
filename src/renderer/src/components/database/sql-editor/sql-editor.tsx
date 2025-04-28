import React from 'react'
import AppHeader from '@/components/app-header'
import {Button} from '@/components/ui/button'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import {CommandIcon, CornerDownLeftIcon, Loader2Icon} from 'lucide-react'
import useSqlEditor from './use-sql-editor'
import CodeEditor from './code-editor'
import {Query} from 'src/shared/schema/app-schema'
import DataTableV2 from '../table-explorer/data-table/data-table-v2'
import { useTheme } from 'next-themes';
const SqlEditor = (props: { selectedQuery: Query | undefined; isLoading: boolean }) => {
  const { isPending, results, table, editorRef, handleRunQuery } = useSqlEditor({
    selectedQuery: props.selectedQuery
  })
  const { theme } = useTheme();

  return (
    <div className="flex flex-col flex-1 self-stretch !w-[calc(100vw-18rem)] overflow-hidden">
      <AppHeader title={props.selectedQuery?.title || 'New Query'} />
      <ResizablePanelGroup direction="vertical" autoSaveId="persistence">
        <ResizablePanel minSize={20}>
          <CodeEditor
            defaultValue={props.selectedQuery?.query || ''}
            editorRef={editorRef}
            key={props.selectedQuery?.id}
            onRunQuery={handleRunQuery}
            theme={theme}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={20}>
          <div className="flex flex-col h-full w-full">
            <ActionBar handleRunQuery={handleRunQuery} isQueryRunning={isPending} />
            <div className="flex flex-col h-full p-2 font-mono flex-1 self-stretch">
              {results.map((result, index) => (
                <div key={index}>
                  {result.error ? (
                    <p className="text-red-500">{result.error}</p>
                  ) : (
                    <p className="text-green-500">{result.statement.text}</p>
                  )}
                </div>
              ))}
              {results.length > 0 && <DataTableV2 table={table} />}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default React.memo(SqlEditor)

export const ActionBar = (props: { handleRunQuery: () => void; isQueryRunning: boolean }) => {
  return (
    <div className="flex p-2 items-center justify-between border-b">
      <p className="text-lg font-medium leading-none">Results</p>
      <Button onClick={() => props.handleRunQuery()} disabled={props.isQueryRunning}>
        {props.isQueryRunning ? 'Running...' : 'Run'}
        {props.isQueryRunning ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground">
            <CommandIcon className="w-4 h-4" />
            <span>+</span>
            <CornerDownLeftIcon />
          </span>
        )}
      </Button>
    </div>
  )
}
