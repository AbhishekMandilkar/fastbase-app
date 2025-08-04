import {title} from '@fastbase/shared/utils/title'
import {createFileRoute} from '@tanstack/react-router'
import CreateConnection from './-components/create-conntection'
import {DatabasesList} from './-components/databases-list'
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@fastbase/ui/components/sidebar'


const CreateConnectionPage = () => {
  return (
    <SidebarProvider>
      <DatabasesList />
      <SidebarInset>
      <SidebarTrigger className="m-2" />
        <CreateConnection />
      </SidebarInset>
    </SidebarProvider>
  )
}


export const Route = createFileRoute('/(protected)/_protected/')({
  component: CreateConnectionPage,
  head: () => ({
    meta: [
      {
        title: title('Create connection'),
      },
    ],
  }),
})


export default CreateConnectionPage