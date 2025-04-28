import SidebarListing from '@/components/ui/sidebar-listing'
import useRecentQueries from './use-recent-queries'
import {Query} from 'src/shared/schema/app-schema'
import {Link, useParams} from 'react-router'
import RecentQueryItem from './recent-query-item'
import {TrashIcon} from 'lucide-react'

const RecentQueries = () => {
  const { queries, isLoading, handleDelete, isDeleting, searchQueries } = useRecentQueries({ fetchOnMount: true })
  const {queryId} = useParams();
  

  const renderItem = ({ item }: { item: Query }) => {
    return (
      <Link to={`${item.id}`} className="flex items-center justify-between w-full">
        <RecentQueryItem query={item} />
      </Link>
    )
  }
  console.log(isDeleting)
  return (
    <SidebarListing
      title="Recent Queries"
      renderItem={renderItem}
      items={queries || []}
      isLoading={isLoading}
      selectedItem={queryId}
      activeItemKey="id"
      getKey={(item) => item?.id}
      actionLoaderKey={isDeleting}
      dropDownActions={[{
        title: 'Delete',
        icon: TrashIcon,
        onClick: (item) => handleDelete(item, true)
      }]}
      onSearch={searchQueries}
    />
  )
}

export default RecentQueries

