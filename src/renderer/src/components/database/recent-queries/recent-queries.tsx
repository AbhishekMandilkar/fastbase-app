import SidebarListing from '@/components/ui/sidebar-listing'
import useRecentQueries from './use-recent-queries'
import {Query} from 'src/shared/schema/app-schema'
import {Link, useNavigate, useParams} from 'react-router'
import RecentQueryItem from './recent-query-item'
import {PlusIcon, TrashIcon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {NEW_QUERY_ID, NEW_QUERY_TITLE} from './utils'

const RecentQueries = () => {
  const { queries, isLoading, handleDelete, isDeleting, searchQueries } = useRecentQueries({ fetchOnMount: true })
  const {queryId, connectionId} = useParams();
  const navigate = useNavigate()

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
      getKey={(item) => item?.id}
      actionLoaderKey={isDeleting}
      dropDownActions={[
        {
          title: 'Delete',
          icon: TrashIcon,
          onClick: (item) => handleDelete(item, true)
        }
      ]}
      onSearch={searchQueries}
      headerRight={
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(`${NEW_QUERY_ID}`)
          }
        >
          <PlusIcon />
        </Button>
      }
    />
  )
}

export default RecentQueries

