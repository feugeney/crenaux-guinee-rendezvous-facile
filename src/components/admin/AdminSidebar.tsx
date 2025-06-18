
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarHeaderComponent } from './sidebar/SidebarHeaderComponent';
import { NavigationMenu } from './sidebar/NavigationMenu';

export const AdminSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeaderComponent />
      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>
    </Sidebar>
  );
};
