import React from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Globe, LinkIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import {Tooltip, TooltipTrigger, TooltipContent} from '@/components/ui/tooltip'

interface ImportUrlDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  urlInput: string
  onUrlInputChange: (value: string) => void
  onImport: () => void
}

const ImportUrlDialog: React.FC<ImportUrlDialogProps> = ({
  isOpen,
  onOpenChange,
  urlInput,
  onUrlInputChange,
  onImport,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Globe />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Import connection from URL</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Connection URL</DialogTitle>
          <DialogDescription>Paste your PostgreSQL connection URL below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="url">Connection URL</Label>
            <Input
              id="url"
              placeholder="postgresql://user:password@localhost:5432/dbname"
              value={urlInput}
              onChange={(e) => onUrlInputChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportUrlDialog 