'use client'

import * as React from 'react'
import { ArchiveX, CodeIcon, Command, File, Inbox, MessageCircleIcon, Send, TableIcon, Trash2 } from 'lucide-react'

import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import Brand from './brand'
import { Link, Navigate, useLocation, useParams } from 'react-router'
import { ThemeToggle } from './theme-switcher'
import { Separator } from './ui/separator'
import DisconnectButton from './disconnect-button'
import {useMemo} from 'react'

const data = {
  navMain: [
    {
      title: 'Tables',
      url: 'tables',
      icon: TableIcon
    },
    {
      title: 'SQL Queries',
      url: 'sql-queries',
      icon: CodeIcon
    },
    {
      title: 'Chat',
      url: 'chat',
      icon: MessageCircleIcon
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { pathname } = location
  const activeRoute = useMemo(() => pathname.split('/').filter(Boolean)[2], [pathname]);
  
  const params = useParams()
  const connectionId = params.connectionId

  if (!connectionId) {
    return <Navigate to="/" />
  }

  return (
    <Sidebar
      {...props}
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="p-0">
              <a href="#">
                <Brand showText={false} />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-0">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false
                    }}
                    asChild
                    isActive={activeRoute === item.url}
                    className={`px-2.5 md:px-2`}
                  >
                    <Link to={item.url}>
                      <item.icon className='' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <DisconnectButton />
      </SidebarFooter>
    </Sidebar>
  )
}
