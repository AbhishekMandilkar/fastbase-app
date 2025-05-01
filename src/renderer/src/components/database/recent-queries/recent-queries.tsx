import SidebarListing from '@/components/ui/sidebar-listing'
import useRecentQueries from './use-recent-queries'
import {Query} from 'src/shared/schema/app-schema'
import {Link, useNavigate, useParams} from 'react-router'
import RecentQueryItem from './recent-query-item'
import {PlusIcon, StarIcon, TrashIcon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {NEW_QUERY_ID, NEW_QUERY_TITLE} from './utils'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'

const RecentQueries = () => {
  const { queries, isLoading, handleDelete, isDeleting, searchQueries, handleTabChange, activeTab } = useRecentQueries({ fetchOnMount: true })
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
      dropDownActions={(item) => [
        {
          title: 'Delete',
          icon: TrashIcon,
          onClick: (item) => handleDelete(item, true)
        }
      ]}
      onSearch={searchQueries}
      headerRight={
        <Button variant="outline" size="icon" onClick={() => navigate(`${NEW_QUERY_ID}`)}>
          <PlusIcon />
        </Button>
      }
      subHeader={
        <Tabs
          defaultValue={activeTab}
          className="w-full"
          onValueChange={(value) => handleTabChange(value as 'Recent' | 'Favorites')}
        >
          <TabsList className="w-full">
            <TabsTrigger value="Recent" className="w-full [data-state=active]:bg-red-500">
              Recent
            </TabsTrigger>
            <TabsTrigger value="Favorites" className="w-full [data-state=active]:bg-blue-500">
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    />
  )
}

export default RecentQueries

