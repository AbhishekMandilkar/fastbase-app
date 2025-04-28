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
