'use client'

import { Filter as FilterIcon, Plus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const OPERATORS = [
  { label: 'equals', value: 'equals', symbol: '=' },
  { label: 'not equals', value: 'not_equals', symbol: '<>' },
  { label: 'greater', value: 'greater', symbol: '>' },
  { label: 'greater or equals', value: 'greater_or_equals', symbol: '>=' },
  { label: 'less', value: 'less', symbol: '<' },
  { label: 'less or equals', value: 'less_or_equals', symbol: '<=' },
  { label: 'like', value: 'like', symbol: 'LIKE' }
]

export interface FilterState {
  conjunction: 'where' | 'and' | 'or'
  column: string
  operator: string
  value: string
}

export interface FilterComponentProps {
  columns: string[]
  onApplyFilters: (sqlWhereClause: string) => void
  handleActiveFilterCountChange: (count: number) => void
  show: boolean
}

export function FilterComponent({
  columns,
  onApplyFilters,
  handleActiveFilterCountChange,
  show
}: FilterComponentProps) {
  const [filters, setFilters] = useState<FilterState[]>([
    { conjunction: 'where', column: columns[0] || '', operator: 'equals', value: '' }
  ])
  const [isDirty, setIsDirty] = useState(false)

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        conjunction: 'and',
        column: columns[0] || '',
        operator: 'equals',
        value: ''
      }
    ])
    setIsDirty(true)
  }

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(
      newFilters.length > 0
        ? newFilters
        : [{ conjunction: 'where', column: columns[0] || '', operator: 'equals', value: '' }]
    )
    setIsDirty(true)
  }

  const handleFilterChange = (index: number, key: keyof FilterState, value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [key]: value }
    setFilters(newFilters)
    setIsDirty(true)
  }

  const handleClearFilters = () => {
    setFilters([{ conjunction: 'where', column: columns[0] || '', operator: 'equals', value: '' }])
    handleApply(true)
    setIsDirty(true)
  }

  const generateSqlWhereClause = () => {
    const validFilters = filters.filter((f) => f.value.trim() !== '')

    return validFilters
      .map((filter, index) => {
        const operator = OPERATORS.find((op) => op.value === filter.operator)

        if (filter.operator === 'like') {
          return `${index === 0 ? 'WHERE' : filter.conjunction.toUpperCase()} ${filter.column} LIKE '%${filter.value}%'`
        }

        return `${index === 0 ? 'WHERE' : filter.conjunction.toUpperCase()} ${filter.column} ${operator?.symbol} '${filter.value}'`
      })
      .join(' ')
  }

  const handleApply = (resetFilters: boolean = false) => {
    if (resetFilters) {
      onApplyFilters('')
      handleActiveFilterCountChange(0)
      setIsDirty(false)
      return
    }
    const sqlWhereClause = generateSqlWhereClause()
    onApplyFilters(sqlWhereClause)
    handleActiveFilterCountChange(filters.length)
    setIsDirty(false)
  }

  const areAllFiltersValid = filters.every((filter) => filter.value.trim() !== '')

  if (!show) return null

  return (
    <div className="rounded-md flex p-1 space-x-1">
      <div className="space-y-2 flex-1">
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="icon" onClick={() => handleRemoveFilter(index)}>
              <X className="size-1" />
            </Button>

            {index === 0 ? (
              <div className="bg-background border rounded px-2 py-2 text-sm font-mono w-[70px]">
                where
              </div>
            ) : (
              <Select
                value={filter.conjunction}
                onValueChange={(value) =>
                  handleFilterChange(index, 'conjunction', value as 'and' | 'or')
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="and" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">&&</SelectItem>
                  <SelectItem value="or">||</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select
              value={filter.column}
              onValueChange={(value) => handleFilterChange(index, 'column', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.operator}
              onValueChange={(value) => handleFilterChange(index, 'operator', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="equals" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    <div className="flex justify-between w-full">
                      <span>{op.label}</span>
                      <span className="text-muted-foreground ml-2 px-2 bg-muted rounded">
                        {op.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={filter.value}
              onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 max-w-[240px]"
            />

            {index === 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddFilter}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => handleApply(false)}
          disabled={!areAllFiltersValid}
        >
          Apply
        </Button>

        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  )
}
