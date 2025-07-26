import {MessageSquare} from 'lucide-react'

export function ChatPlaceholder() {
  return (
    <div className="pointer-events-none absolute z-10 inset-0 flex justify-center items-center px-6 pb-[15vh]">
      <div className="pointer-events-auto text-center text-balance max-w-96">
        <MessageSquare className="mx-auto mb-2 size-8" />
        <p className="text-sm">Ask AI to generate SQL queries</p>
      </div>
    </div>
  )
}
