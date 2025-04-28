import SidebarListing from '@/components/ui/sidebar-listing'
import useRecentQueries from './use-recent-queries'
import {Query} from 'src/shared/schema/app-schema'
import {useMutation} from '@tanstack/react-query'
import {getQueryName, NEW_QUERY_TITLE} from './utils'
import {useEffect, useState} from 'react'
import {actionsProxy} from '@/lib/action-proxy'
import {Link, useParams} from 'react-router'
import RecentQueryItem from './recent-query-item'

const RecentQueries = () => {
  const { queries, isLoading } = useRecentQueries({ fetchOnMount: true })
  const {queryId} = useParams();
  console.log(queryId)
  const renderItem = ({ item }: { item: Query }) => {
    return (
      <Link to={`${item.id}`} className="flex items-center justify-between w-full">
        <RecentQueryItem query={item} />
      </Link>
    )
  }

  return (
    <SidebarListing
      title="Recent Queries"
      renderItem={renderItem}
      items={queries || []}
      isLoading={isLoading}
      selectedItem={queryId}
      activeItemKey="id"
    />
  )
}

export default RecentQueries

