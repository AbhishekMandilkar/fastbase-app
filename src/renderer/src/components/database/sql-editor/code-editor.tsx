// components/SqlEditor.tsx

import React, {useEffect} from 'react'
import ControlledEditor, {useMonaco} from '@monaco-editor/react'
import {editor} from 'monaco-editor'
import {useTheme} from 'next-themes'

const CodeEditor: React.FC<{
  defaultValue: string
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>
  onRunQuery?: () => void
}> = ({ defaultValue, editorRef, onRunQuery }) => {
  const { theme } = useTheme();
  const monaco = useMonaco();
  const isDarkMode = theme === 'dark'
  
  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor
    
    // Add keyboard shortcut for Cmd+Enter
    if (monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRunQuery?.()
      })
    }
  }

  useEffect(() => {
    if (monaco) {
      monaco.languages.registerCompletionItemProvider('sql', {
        // @ts-ignore
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: 'SELECT',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'SELECT ',
            },
            {
              label: 'FROM',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'FROM ',
            },
            {
              label: 'WHERE',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'WHERE ',
            },
            {
              label: 'INSERT',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'INSERT ',
            },
            {
              label: 'UPDATE',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'UPDATE ',
            },
            {
              label: 'DELETE',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'DELETE ',
            },
            {
              label: 'JOIN',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'JOIN ',
            },
          ];
          return { suggestions };
        }
      });
    }
  }, [monaco]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ControlledEditor
        height="100%"
        defaultLanguage="sql"
        defaultValue={defaultValue}
        onChange={(value, event) => {
          console.log(value, event)
        }}
        theme={isDarkMode ? 'vs-dark' : 'light'}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          wordWrap: 'on',
          automaticLayout: true
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}

export default React.memo(CodeEditor, (prevProps, nextProps) => {
  return prevProps.defaultValue === nextProps.defaultValue
})
