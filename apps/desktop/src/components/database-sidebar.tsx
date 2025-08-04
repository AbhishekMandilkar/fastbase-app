import {getOS} from '@fastbase/shared/utils/os'
import {AppLogo} from '@fastbase/ui/components/brand/app-logo'
import {Button} from '@fastbase/ui/components/button'
import {ScrollArea} from '@fastbase/ui/components/custom/scroll-area'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@fastbase/ui/components/tooltip'
import {clickHandlers, cn} from '@fastbase/ui/lib/utils'
import {Link, useLocation, useMatches, useNavigate, useParams} from '@tanstack/react-router'
import {useEffect} from 'react'
import {ThemeToggle} from '~/components/theme-toggle'
import {UserButton} from '~/entities/user'
import {actionsCenterStore} from '~/routes/(protected)/-components/actions-center'
import {Route} from '../routes/(protected)/_protected/database/$id'
import {useLastOpenedTable} from '../routes/(protected)/_protected/database/-hooks/use-last-opened-table'
import {Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarFooter} from '@fastbase/ui/components/sidebar'
import Brand from '@fastbase/ui/components/brand/brand'
import {Separator} from '@fastbase/ui/components/separator'
import {AppleIcon, CodeIcon, HomeIcon, ListIcon, Moon, TableIcon} from 'lucide-react'

const os = getOS()

export function DatabaseSidebar({className, ...props}: React.ComponentProps<'div'>) {
  const {id} = Route.useParams()
  const {table: tableParam, schema: schemaParam} = useParams({strict: false})
  const navigate = useNavigate()
  const location = useLocation()
  const [lastOpenedTable, setLastOpenedTable] = useLastOpenedTable(id)

  useEffect(() => {
    if (tableParam && schemaParam) {
      setLastOpenedTable({schema: schemaParam, table: tableParam})
    }
  }, [tableParam, schemaParam])

  function onTablesClick() {
    if (lastOpenedTable?.schema === schemaParam && lastOpenedTable?.table === tableParam) {
      setLastOpenedTable(null)
    }

    if (lastOpenedTable) {
      navigate({
        to: '/database/$id/tables/$schema/$table',
        params: {
          id,
          schema: lastOpenedTable.schema,
          table: lastOpenedTable.table,
        },
      })
    }
    else {
      navigate({
        to: '/database/$id/tables',
        params: {id},
      })
    }
  }

  const classes = (isActive = false) => cn(
    'cursor-pointer text-foreground size-9 rounded-md flex items-center justify-center border border-transparent',
    isActive && 'bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary',
  )

  const routes = [
    {
      label: 'SQL Runner',
      icon: CodeIcon,
      to: '/database/$id/sql',
    },
    {
      label: 'Tables',
      icon: TableIcon,
      to: '/database/$id/tables',
    },
    {
      label: 'Enums',
      icon: ListIcon,
      to: '/database/$id/enums',
    },
  ]

  return (
    <Sidebar
      {...props}
      collapsible="none"
      className="!w-[calc(var(--sidebar-width-icon)_+_1px)] h-screen"
    >
      <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <HomeIcon className="size-8" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-0">
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.label}>
                  <SidebarMenuButton
                    tooltip={{
                      children: route.label,
                      hidden: false
                    }}
                    asChild
                    isActive={location.pathname.includes(route.to.split('/').pop()!)}
                    className={`px-2.5 md:px-2`}
                  >
                    <Link
                      to={route.to}
                      params={{id}}
                      {...clickHandlers(() => navigate({
                        to: route.to,
                        params: {id},
                      }))}
                    >
                      <route.icon className='size-4' />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle>
          <Button variant="ghost" size="icon">
            <Moon className="size-4" />
          </Button>
        </ThemeToggle>
      </SidebarFooter>
    </Sidebar>

  )
}
