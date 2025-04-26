import React from 'react'
import AppHeader from '@/components/app-header'
import {Button} from '@/components/ui/button'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import {CommandIcon, CornerDownLeftIcon, Loader2Icon} from 'lucide-react'
import useSqlEditor from './use-sql-editor'
import {DataTable} from '../table-explorer/data-table/data-table'
import CodeEditor from './code-editor'

const SqlEditor = () => {
  const { code, isPending, results, table, editorRef, handleRunQuery } =
    useSqlEditor()

  return (
    <div className="flex flex-col h-screen w-full">
      <AppHeader title="SQL Editor" />
      <ResizablePanelGroup direction="vertical" autoSaveId="persistence">
        <ResizablePanel minSize={20}>
          <CodeEditor defaultValue={code} editorRef={editorRef} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex border-b p-2 bg-primary-foreground justify-between items-center">
              <small className="text-lg font-medium leading-none">Results</small>
              <Button onClick={() => handleRunQuery()} disabled={isPending}>
                {isPending ? 'Running...' : 'Run'}
                {isPending ? (
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
            <div className="flex flex-col h-full p-2 font-mono">
              {results.map((result, index) => (
                <div key={index}>
                  {result.error ? (
                    <p className="text-red-500">{result.error}</p>
                  ) : (
                    <p className="text-green-500">{result.statement.text}</p>
                  )}
                </div>
              ))}
              <DataTable table={table} />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default React.memo(SqlEditor)
