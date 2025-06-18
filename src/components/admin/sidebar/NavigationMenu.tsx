
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { menuItems } from './menuItems';
import { useNavigationState } from './navigationUtils';

export const NavigationMenu = () => {
  const { state: sidebarState } = useSidebar();
  const { hasActiveSubmenu, getNavClass } = useNavigationState();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.submenu ? (
                <Collapsible defaultOpen={hasActiveSubmenu(item)} className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={sidebarState === 'collapsed' ? item.title : undefined}
                      className={`${getNavClass(item.url)} w-full justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {sidebarState === 'expanded' && (
                          <span>{item.title}</span>
                        )}
                      </div>
                      {sidebarState === 'expanded' && (
                        <svg className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" 
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {sidebarState === 'expanded' && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.submenu.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to={subItem.url} 
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ml-4 ${getNavClass(subItem.url)}`}
                              >
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ) : (
                <SidebarMenuButton 
                  asChild
                  tooltip={sidebarState === 'collapsed' ? item.title : undefined}
                >
                  <NavLink 
                    to={item.url} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavClass(item.url)}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarState === 'expanded' && (
                      <span>{item.title}</span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
