
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SigecHeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const SigecHeader: React.FC<SigecHeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
