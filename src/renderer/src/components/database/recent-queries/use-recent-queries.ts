import { actionsProxy } from '@/lib/action-proxy'
import {queryClient} from '@/lib/query-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import {toast} from 'sonner'
import { QueryInsert, Query } from 'src/shared/schema/app-schema'
import {useDebounceCallback} from 'usehooks-ts'
import {NEW_QUERY_ID} from './utils'

export const RECENT_QUERIES_QUERY_KEY = 'recent-queries'

const useRecentQueries = (params: { fetchOnMount?: boolean }) => {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  
  const [isDeleting, setIsDeleting] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'Recent' | 'Favorites'>('Recent')
  
  const [searchQuery, setSearchQuery] = useState('')
  const fetchQueries = useQuery({
    queryKey: [RECENT_QUERIES_QUERY_KEY, connectionId, searchQuery, activeTab],
    queryFn: () =>
      actionsProxy.getQueries.invoke({
        connectionId: connectionId as string,
        query: searchQuery,
        isFavorite: activeTab === 'Favorites'
      }),
    enabled: params.fetchOnMount
  })
  const { mutateAsync: deleteQuery } = useMutation({
    mutationFn: (id: string) => actionsProxy.deleteQuery.invoke({ id })
  })
  const createQuery = useMutation({
    mutationFn: (query: QueryInsert) => actionsProxy.createQuery.invoke(query)
  })


  const handleCreateQuery = useCallback(async (query: QueryInsert) => {
    const newQuery = await createQuery.mutateAsync(query)
    queryClient.invalidateQueries({queryKey: [RECENT_QUERIES_QUERY_KEY, connectionId]}) 
    navigate(`${newQuery.id}`)
  }, [createQuery, connectionId])

  const handleDelete = useCallback(async (item: Query, invalidate?: boolean) => {
    try {
      setIsDeleting(item.id)
      await deleteQuery(item.id)
      setIsDeleting(undefined)
      if (invalidate) {
        fetchQueries.refetch()
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete query')
    }
  }, [deleteQuery, connectionId])

  const debouncedSearch = useDebounceCallback(setSearchQuery, 500)

  const handleTabChange = useCallback((tab: 'Recent' | 'Favorites') => {
    setActiveTab(tab)
    fetchQueries.refetch()
  }, [fetchQueries])

  return {
    queries: fetchQueries.data,
    isLoading: fetchQueries.isPending || createQuery.isPending,
    handleCreateQuery,
    error: fetchQueries.error || createQuery.error,
    isDeleting,
    handleDelete,
    searchQueries: debouncedSearch,
    handleTabChange,
    activeTab
  }
}

export default useRecentQueries
