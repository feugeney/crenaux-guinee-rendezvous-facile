
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  Calendar, 
  BookOpen, 
  Flag, 
  BarChart3, 
  Settings,
  Home,
  Clock,
  CalendarCheck,
  Users,
  UserPlus
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/sidebar';

const menuItems = [
  { 
    title: 'Tableau de bord', 
    url: '/admin', 
    icon: Home 
  },
  { 
    title: 'Gestion des créneaux', 
    url: '/admin/time-slots', 
    icon: Calendar 
  },
  { 
    title: 'Gestion des réservations', 
    url: '/admin/bookings', 
    icon: BookOpen,
    submenu: [
      {
        title: 'Rendez-vous express',
        url: '/admin/bookings/express',
        icon: Clock
      },
      {
        title: 'Rendez-vous standard',
        url: '/admin/bookings/standard',
        icon: CalendarCheck
      }
    ]
  },
  { 
    title: 'Programme politique', 
    url: '/admin/political-program', 
    icon: Flag,
    submenu: [
      {
        title: 'Gestion des candidatures',
        url: '/admin/political-program/applications',
        icon: UserPlus
      },
      {
        title: 'Candidats inscrits',
        url: '/admin/political-program/candidates',
        icon: Users
      }
    ]
  },
  { 
    title: 'Rapports', 
    url: '/admin/reports', 
    icon: BarChart3 
  },
  { 
    title: 'Paramètres', 
    url: '/admin/settings', 
    icon: Settings 
  },
];

export const AdminSidebar = () => {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const hasActiveSubmenu = (item: any) => {
    if (!item.submenu) return false;
    return item.submenu.some((subItem: any) => isActive(subItem.url));
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-gold-100 text-gold-900 font-medium" 
      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900";
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-600 rounded-lg flex items-center justify-center">
            <Flag className="h-4 w-4 text-white" />
          </div>
          {sidebarState === 'expanded' && (
            <div>
              <h2 className="font-bold text-lg">Admin</h2>
              <p className="text-sm text-gray-500">Tableau de bord</p>
            </div>
          )}
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent>
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
      </SidebarContent>
    </Sidebar>
  );
};
