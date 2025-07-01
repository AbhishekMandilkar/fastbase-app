import {title} from '@fastbase/shared/utils/title'
import {createFileRoute, Outlet} from '@tanstack/react-router'
import {databaseQuery, prefetchDatabaseCore, useDatabase} from '~/entities/database'
import {queryClient} from '~/main'
import {DatabaseSidebar} from '../../../../components/database-sidebar'
import {PasswordForm} from './-components/password-form'
import {SidebarInset, SidebarProvider} from '@fastbase/ui/components/sidebar'

export const Route = createFileRoute('/(protected)/_protected/database/$id')({
  component: DatabasePage,
  beforeLoad: async ({params}) => {
    const database = await queryClient.ensureQueryData(databaseQuery(params.id))

    prefetchDatabaseCore(database)

    return {database}
  },
  loader: ({context}) => ({database: context.database}),
  head: ({loaderData}) => ({
    meta: loaderData
      ? [
        {
          title: title(loaderData.database.name),
        },
      ]
      : [],
  }),
})

function DatabasePage() {
  const {id} = Route.useParams()
  const {data: database} = useDatabase(id)

  if (database.isPasswordExists && !database.isPasswordPopulated) {
    return <PasswordForm database={database} />
  }

  return (
    <div className="min-h-[inherit] h-screen flex bg-gray-100 dark:bg-neutral-950/60">
    <DatabaseSidebar className="w-16" />
    <div className="h-screen w-[calc(99vw-var(--sidebar-width-icon))]">
      <Outlet />
    </div>
  </div>
  )
}
