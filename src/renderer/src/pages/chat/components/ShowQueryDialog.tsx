import React from 'react';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import CodeBlock from '../code-block'; // Adjusted import path
import { cn } from '@/lib/utils';

interface ShowQueryDialogProps {
  query: string;
  onClickCopy: () => void;
  triggerButtonClassName?: string;
  triggerButtonText?: string;
}

const ShowQueryDialog: React.FC<ShowQueryDialogProps> = ({
  query,
  onClickCopy,
  triggerButtonClassName,
  triggerButtonText = 'Show Query'
}) => {
  if (!query) return null; // Don't render if there's no query

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className={cn("underline", triggerButtonClassName)}>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[3xl] min-h-[80vh] overflow-y-auto">
        <div className="grid gap-4 py-4">
          <CodeBlock code={query} />
        </div>
        <DialogFooter>
          <Button type="button" size={'icon'} onClick={onClickCopy}>
            <CopyIcon className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShowQueryDialog; 