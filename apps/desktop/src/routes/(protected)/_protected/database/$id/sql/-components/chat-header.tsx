import type { UseChatHelpers } from '@ai-sdk/react'
import { Button } from '@conar/ui/components/button'
import { CardTitle } from '@conar/ui/components/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@conar/ui/components/tooltip'
import {Trash} from 'lucide-react'

export function ChatHeader({
  messages,
  setMessages,
}: Pick<UseChatHelpers, 'messages' | 'setMessages'>) {
  return (
    <div className="flex justify-between items-center h-8">
      <CardTitle className="flex items-center gap-2">
        Chat to SQL
      </CardTitle>
      {messages.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMessages([])}
              >
                <Trash className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Clear chat history
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
