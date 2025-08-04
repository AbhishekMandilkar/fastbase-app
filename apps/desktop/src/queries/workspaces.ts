import { queryOptions } from '@tanstack/react-query'

export function workspacesQuery() {
  return queryOptions({
    queryKey: ['workspaces', 'list'],
    queryFn: () => null,
  })
}
