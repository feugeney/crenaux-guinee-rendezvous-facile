
import React from 'react';
import { Flag } from 'lucide-react';
import { SidebarHeader, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export const SidebarHeaderComponent = () => {
  const { state: sidebarState } = useSidebar();

  return (
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
  );
};
