
export default function Component({ code }: { code: string }) {
  

  return (
    <div className="p-4 font-mono text-sm leading-6 text-foreground overflow-x-auto">
      <pre className="sql">
        <code>{code}</code>
      </pre>
    </div>
  )
}
