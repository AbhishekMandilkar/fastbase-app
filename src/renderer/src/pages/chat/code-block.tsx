
import CodeEditor from '@/components/database/sql-editor/code-editor'
import ControlledEditor, {Monaco, useMonaco} from '@monaco-editor/react'
import {editor} from 'monaco-editor'
import { useTheme } from 'next-themes'
import {useRef} from 'react'

export default function Component({ code }: { code: string }) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  return (
    <CodeEditor defaultValue={code} editorRef={editorRef}  theme={'dark'} />
  )
  //   <div className="w-full h-full">
  // return (
  //   <div className="">
  //     {/* <pre className="sql">
  //       <code>{code}</code>
  //     </pre> */}
  //     <ControlledEditor
  //       height="100%"
  //       defaultLanguage="sql"
  //       defaultValue={code}
  //       theme={isDarkMode ? 'vs-dark' : 'light'}
  //       options={{
  //         fontSize: 14,
  //         wordWrap: 'on',
  //         automaticLayout: true
  //       }}
  //     />
  //   </div>
  // )
}
