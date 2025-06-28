import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React from 'react'
export default function TablePagination({
  isTotalRowsFetching,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  totalItems
}: {
  rowsPerPage: number
  setRowsPerPage: (rowsPerPage: number) => void
  page: number
  setPage: (page: number) => void
  totalItems: number
  isTotalRowsFetching: boolean
}) {
  const start = page;
  const end = start + rowsPerPage;
  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">Rows per page:</Label>
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(rowsPerPage) => setRowsPerPage(+rowsPerPage)}
        >
          <SelectTrigger className="w-[65px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {isTotalRowsFetching ? (
            <Skeleton className="w-[100px] h-4" />
          ) : (
            `${start}-${end} of ${totalItems}`
          )}
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="Go to previous page"
                size="icon"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage(page - rowsPerPage)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Go to next page"
                size="icon"
                variant="ghost"
                disabled={end > totalItems}
                onClick={() => setPage(page + rowsPerPage)}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
