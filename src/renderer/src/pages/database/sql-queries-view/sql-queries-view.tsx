import RecentQueries from '@/components/database/recent-queries/recent-queries';
import SqlEditor from '@/components/database/sql-editor/sql-editor';
import {actionsProxy} from '@/lib/action-proxy';
import {useQuery} from '@tanstack/react-query';
import {Outlet, useParams} from 'react-router';

function SqlQueriesView() {
  const {queryId} = useParams();

  const {data: query, isLoading: isQueryLoading} = useQuery({
    queryFn: () => queryId ? actionsProxy.getQuery.invoke({id: queryId}) : undefined,
    queryKey: ['query', queryId],
    enabled: Boolean(queryId)
  })

  return (
    <div className="flex flex-1">
      <RecentQueries />
      <SqlEditor selectedQuery={query} isLoading={isQueryLoading} />
    </div>
  )
}

export default SqlQueriesView
