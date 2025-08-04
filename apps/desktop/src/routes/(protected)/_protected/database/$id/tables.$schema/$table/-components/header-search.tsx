import type {SQL_OPERATORS_LIST} from '@fastbase/shared/utils/sql'
import {Button} from '@fastbase/ui/components/button'
import {ContentSwitch} from '@fastbase/ui/components/custom/content-switch'
import {LoadingContent} from '@fastbase/ui/components/custom/loading-content'
import {Input} from '@fastbase/ui/components/input'
import {useMutation} from '@tanstack/react-query'
import {useStore} from '@tanstack/react-store'
import {useMemo, useState} from 'react'
import {toast} from 'sonner'
import {useDatabase, useDatabaseEnums} from '~/entities/database'
import {Route, usePageContext} from '..'
import {useColumnsQuery} from '../-queries/use-columns-query'
import {Check, Sparkles} from 'lucide-react'
import {Send} from 'lucide-react'
import {Popover, PopoverContent, PopoverTrigger} from '@fastbase/ui/components/popover'

type Filter = {
  column: string
  operator: typeof SQL_OPERATORS_LIST[number]['value']
  value: string
}

const mutationFn = async ({prompt, context}: {prompt: string; context: string}): Promise<Filter[]> => {
  const response = await fetch(`${import.meta.env.VITE_PUBLIC_API_URL}/ai/filters`, {
    method: 'POST',
    body: JSON.stringify({prompt, context}),
  })
  return response.json()
}

export function HeaderSearch() {
  const {id, table, schema} = Route.useParams()
  const {data: database} = useDatabase(id)
  const {store} = usePageContext()
  const prompt = useStore(store, state => state.prompt)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
  const {mutate: generateFilter, isPending} = useMutation({
    mutationFn,
    onSuccess: (data) => {
      store.setState(state => ({
        ...state,
        filters: data.map(filter => ({
          column: filter.column,
          operator: filter.operator as typeof SQL_OPERATORS_LIST[number]['value'],
          value: filter.value,
        })),
      }))

      if (data.length === 0) {
        toast.info('No filters were generated, please try again with a different prompt')
      }
      
      // Close the popover when data is fetched
      setIsPopoverOpen(false)
    },
  })
  const {data: columns} = useColumnsQuery(database, table, schema)
  const {data: enums} = useDatabaseEnums(database)
  const context = useMemo(() => `
    Filters working with AND operator.
    Table name: ${table}
    Schema name: ${schema}
    Columns: ${JSON.stringify(columns?.map(col => ({
    name: col.name,
    type: col.type,
    default: col.default,
    isNullable: col.isNullable,
  })), null, 2)}
    Enums: ${JSON.stringify(enums, null, 2)}
  `.trim(), [columns, enums, schema, table])


  const renderContent = () => {
    return (
      <form
        className="relative max-w-full w-full transition-all duration-300 ease-in-out"
        onSubmit={(e) => {
          e.preventDefault()
          generateFilter({prompt, context})
        }}
      >
        <Input
          className="pr-10 w-full focus-visible:ring-0 focus-visible:border"
          placeholder="Ask AI to filter data..."
          disabled={isPending}
          value={prompt}
          onChange={e => store.setState(state => ({...state, prompt: e.target.value}))}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <LoadingContent loading={isPending} loaderClassName="size-3">
            <ContentSwitch
              activeContent={<Check className="size-3 text-success" />}
              active={!isPending}
            >
              <Send className="size-3" />
            </ContentSwitch>
          </LoadingContent>
        </Button>
      </form>
    )
  }

  return (<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline" className='bg-gradient-to-l from-[#fb7185] via-[#a21caf] to-[#6366f1] text-white hover:text-white'>
        <Sparkles className="size-4 text-white pointer-events-none" />
        Ask AI
      </Button></PopoverTrigger>
    <PopoverContent className="w-[500px] max-w-full">
      {renderContent()}
    </PopoverContent>
  </Popover>)
}
