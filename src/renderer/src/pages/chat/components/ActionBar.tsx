import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ShowQueryDialog from './ShowQueryDialog';

interface ActionBarProps {
  query: string;
  onClickCopyQuery: () => void;
  onClickCopyResponse: () => void;
  showActionBar: boolean; // To control visibility based on dataResults.length > 0
}

const ActionBar: React.FC<ActionBarProps> = ({
  query,
  onClickCopyQuery,
  onClickCopyResponse,
  showActionBar
}) => {
  if (!showActionBar) return null;

  return (
    <div className="flex justify-end items-center w-full text-xs text-muted-foreground max-w-[500px]">
      <ShowQueryDialog 
        query={query} 
        onClickCopy={onClickCopyQuery} 
        triggerButtonClassName="text-muted-foreground"
      />
      <Separator orientation="vertical" className="h-4 mx-2" /> 
      <Button variant="link" className="underline text-muted-foreground h-auto p-0" onClick={onClickCopyResponse}>
        Copy response
      </Button>
    </div>
  );
};

export default ActionBar; 