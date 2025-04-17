import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { Separator } from '../../components/ui/separator'
import { ThemeToggle } from '../../components/theme-switcher'
import { actionsProxy } from '@/lib/action-proxy'
import Brand from '@/components/brand'
import { useNavigate } from 'react-router'
import useConnectDatabase from '../database/hooks/use-connect-database'
import { toast } from 'sonner'
import { Connection } from 'src/shared/schema/app-schema'
import { useQuery } from '@tanstack/react-query'

export const GET_CONNECTIONS_QUERY_KEY = 'getConnections'

enum ListType {
  Recent = 'Recent',
  Favourite = 'Favourite'
}

const data = {
  navMain: [
    {
      title: ListType.Recent,
      url: '#'
    },
    {
      title: ListType.Favourite,
      url: '#'
    }
  ]
}

export function ConnectionList({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: allConnections } = useQuery({
    queryKey: [GET_CONNECTIONS_QUERY_KEY],
    queryFn: () => actionsProxy.getConnections.invoke()
  })
  const favorites = React.useMemo(
    () => allConnections?.filter((connection) => connection.favourite),
    [allConnections]
  )
  const navigate = useNavigate()
  const { handleConnect } = useConnectDatabase()

  const handleSelectDatabase = async (connection: Connection) => {
    toast.promise(
      async () => {
        const { success } = await handleConnect(connection.id)
        if (success) {
          navigate(`/connection/${connection.id}`)
        }
      },
      {
        loading: 'Connecting...',
        success: 'Connected',
        error: 'Failed to connect'
      }
    )
  }

  const getListByCategory = (type: ListType) => {
    if (type === ListType.Recent) {
      return allConnections
    }
    return favorites
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Brand />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => {
              const connectionList = getListByCategory(item.title)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarGroupLabel>
                    <span className="font-medium font-mono">{item.title}</span>
                  </SidebarGroupLabel>
                  {connectionList?.length ? (
                    <SidebarMenuSub>
                      {connectionList.map((item) => (
                        <SidebarMenuSubItem key={item.id}>
                          <SidebarMenuSubButton
                            onClick={() => handleSelectDatabase(item)}
                            className="cursor-pointer"
                          >
                            <p className="truncate text-ellipsis"> {item.host}</p>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row justify-between items-center">
        <ThemeToggle />
        <div className="text-xs text-muted-foreground">{APP_VERSION}</div>
      </SidebarFooter>
    </Sidebar>
  )
}
