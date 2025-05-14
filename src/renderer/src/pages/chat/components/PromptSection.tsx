import React from 'react';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea
} from '@/components/prompt-input';
import { Button } from '@/components/ui/button';
import { ArrowUp, Square } from 'lucide-react';
import * as motion from 'motion/react-client';
interface PromptSectionProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleSubmit: () => void;
  isDatabaseStructureLoading: boolean;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  isDatabaseStructureLoading
}) => {
  if (isDatabaseStructureLoading) {
    // Or some other placeholder/disabled state, handled by parent currently
    return null; 
  }

  return (
    <motion.div className="max-w-[500px] w-full space-y-1">
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
              disabled={isLoading}
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
    </motion.div>
  );
};

export default PromptSection; 