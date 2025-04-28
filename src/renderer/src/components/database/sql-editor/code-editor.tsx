// components/SqlEditor.tsx

import React, {useCallback, useEffect} from 'react'
import ControlledEditor, {Monaco, useMonaco} from '@monaco-editor/react'
import {editor} from 'monaco-editor'
import {useTheme} from 'next-themes'

const CodeEditor: React.FC<{
  defaultValue: string
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>
  onRunQuery?: () => void
  theme: string | undefined
}> = ({ defaultValue, editorRef, onRunQuery, theme }) => {
  const isDarkMode = theme === 'dark'
  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
  
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunQuery?.()
    })
  }, [onRunQuery, editorRef]);
  
  console.log('RENDERING CODE EDITOR')

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ControlledEditor
        height="100%"
        defaultLanguage="sql"
        defaultValue={defaultValue}
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
  return prevProps.defaultValue === nextProps.defaultValue && prevProps.theme === nextProps.theme
})
