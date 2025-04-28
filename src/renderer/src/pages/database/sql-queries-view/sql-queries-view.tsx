import RecentQueries from '@/components/database/recent-queries/recent-queries';
import {NEW_QUERY_ID} from '@/components/database/recent-queries/utils';
import SqlEditor from '@/components/database/sql-editor/sql-editor';
import {actionsProxy} from '@/lib/action-proxy';
import {useQuery} from '@tanstack/react-query';
import {Outlet, useParams} from 'react-router';

function SqlQueriesView() {
  const {queryId} = useParams();
  const isNewQuery = queryId === NEW_QUERY_ID
  const {data: query, isLoading: isQueryLoading} = useQuery({
    queryFn: () => queryId ? actionsProxy.getQuery.invoke({id: queryId}) : undefined,
    queryKey: ['query', queryId],
    enabled: !isNewQuery
  })

  return (
    <div className={`flex flex-1 h-screen overflow-y-hidden min-w-[calc(100vw-3rem)]`}>
      <RecentQueries />
      <SqlEditor selectedQuery={isNewQuery ? undefined : query} isLoading={isQueryLoading} />
    </div>
  )
}

export default SqlQueriesView
