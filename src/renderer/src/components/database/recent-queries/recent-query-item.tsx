import { getQueryName } from './utils'

import { useMutation } from '@tanstack/react-query'
import { Query } from 'src/shared/schema/app-schema'
import { NEW_QUERY_TITLE } from './utils'
import { actionsProxy } from '@/lib/action-proxy'
import React, { useEffect, useState } from 'react'
import { TypingAnimation } from '@/components/typing-animation'
import { queryClient } from '@/lib/query-client'
import { RECENT_QUERIES_QUERY_KEY } from './use-recent-queries'

const RecentQueryItem = ({ query }: { query: Query }) => {
  const { mutateAsync: updateQuery } = useMutation({
    mutationFn: (query: Query) => actionsProxy.updateQuery.invoke(query)
  })
  const [queryName, setQueryName] = useState(query.title)
  const [showTyping, setShowTyping] = useState(false)

  const generateQueryName = async () => {
    // only generate query name if the query is not a new query and the query is empty
    if (query.title !== NEW_QUERY_TITLE || query.query === '') {
      return
    }
    const text = await getQueryName(query.query)
    console.log(text)
    const updatedQuery = await updateQuery({
      ...query,
      title: text
    })
    setQueryName(text)
    setShowTyping(true)
    // Reset the typing animation after it completes
    setTimeout(() => setShowTyping(false), text.length * 50 + 100)
  }

  useEffect(() => {
    generateQueryName()

    return () => {
      // invalidate the query
      queryClient.invalidateQueries({ queryKey: [RECENT_QUERIES_QUERY_KEY] })
    }
  }, [query.id])

  return (
    <span>
      {showTyping ? <TypingAnimation text={queryName} duration={50} className="" /> : queryName}
    </span>
  )
}

export default React.memo(RecentQueryItem, (prevProps, nextProps) => {
  return (
    prevProps.query.id === nextProps.query.id ||
    prevProps.query.title === nextProps.query.title ||
    prevProps.query.query === nextProps.query.query
  )
})
