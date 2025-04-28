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

interface SidebarListingProps<T> {
  title: string
  items: T[]
  isLoading?: boolean
  selectedItem?: string
  onSearch?: (search: string) => void
  renderItem: ({item}: {item: T}) => React.ReactNode | JSX.Element
  skeletonCount?: number
  activeItemKey?: keyof T
}

function SidebarListing<T>({
  title,
  items,
  isLoading,
  selectedItem,
  onSearch,
  renderItem,
  activeItemKey
}: SidebarListingProps<T>) {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex border-r min-w-64 max-w-64" >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">{title}</div>
        </div>
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
              {(items).map((item, index) => (
                <SidebarMenuItem key={isLoading ? index : (item as any).name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={Boolean(selectedItem) && selectedItem === (item as any)[activeItemKey || 'name']}
                  >
                    {renderItem({item})}
                  </SidebarMenuButton>
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