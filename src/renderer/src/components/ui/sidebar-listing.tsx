import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from './sidebar'
import { Skeleton } from './skeleton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from './button'
import { Loader2, LucideIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/lib/hooks/use-mobile'
interface SidebarListingProps<T> {
  title: string
  items: T[]
  isLoading?: boolean
  selectedItem?: string
  onSearch?: (search: string) => void
  renderItem: ({ item }: { item: T }) => React.ReactNode | JSX.Element
  skeletonCount?: number
  activeItemKey?: keyof T
  getKey?: (item: T) => string
  dropDownActions?: ((item: T) => {
    title: string
    onClick: (item: T) => void
    icon?: LucideIcon
  }[])
  // note this key should be always same as the key of the item read the item key from the item
  actionLoaderKey?: string
  headerRight?: React.ReactNode,
  subHeader?: React.ReactNode
}

function SidebarListing<T>({
  title,
  items,
  isLoading,
  selectedItem,
  onSearch,
  renderItem,
  activeItemKey,
  getKey,
  dropDownActions,
  actionLoaderKey,
  headerRight,
  subHeader
}: SidebarListingProps<T>) {
  const isMobile = useIsMobile();

  const renderDropDownActions = (item: T) => {
    const isLoading = actionLoaderKey === getKey?.(item || (item as any).id);

    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          className="min-w-56 rounded-lg"
        >
          {(() => {
            const actions = dropDownActions?.(item)
            if (actions) {
              return actions.map((action) => (
                <DropdownMenuItem
                  key={action.title}
                  onClick={() => action.onClick(item)}
                  className="cursor-pointer"
                >
                  {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                  {action.title}
                </DropdownMenuItem>
              ))
            }
            return null
          })()}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const sidebarMenuItemClassName = cn(dropDownActions && 'flex space-x-2')

  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex border-r min-w-64 max-w-64">
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">{title}</div>
          {headerRight}
        </div>
        {subHeader}
        <SidebarInput
          placeholder="Type to search..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarListingSkeleton />
            ) : (
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem
                    key={isLoading ? index : getKey?.(item) || (item as any).id}
                    className={sidebarMenuItemClassName}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={
                        Boolean(selectedItem) &&
                        selectedItem === (item as any)[activeItemKey || 'name']
                      }
                    >
                      {renderItem({ item })}
                    </SidebarMenuButton>
                    {dropDownActions && renderDropDownActions(item)}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarListing

const SidebarListingSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
    </div>
  )
}
