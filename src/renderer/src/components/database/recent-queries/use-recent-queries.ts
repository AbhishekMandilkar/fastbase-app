import { actionsProxy } from '@/lib/action-proxy'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router'
import { QueryInsert } from 'src/shared/schema/app-schema'

export const RECENT_QUERIES_QUERY_KEY = 'recent-queries'

const useRecentQueries = (params: { fetchOnMount?: boolean }) => {
  const { connectionId } = useParams()
  const fetchQueries = useQuery({
    queryKey: [RECENT_QUERIES_QUERY_KEY, connectionId],
    queryFn: () => actionsProxy.getQueries.invoke({ connectionId: connectionId as string }),
    enabled: params.fetchOnMount
  })

  const createQuery = useMutation({
    mutationFn: (query: QueryInsert) => actionsProxy.createQuery.invoke(query)
  })

  return {
    queries: fetchQueries.data,
    isLoading: fetchQueries.isLoading || createQuery.isPending,
    handleCreateQuery: createQuery.mutateAsync,
    error: fetchQueries.error || createQuery.error
  }
}

export default useRecentQueries
