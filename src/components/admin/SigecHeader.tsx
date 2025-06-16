
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
        <div className="flex items-center justify-between">
          {/* Menu toggle et identification */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">EPAC-001 • Version 1.0</div>
                <Badge variant="outline" className="mt-1">
                  SIG-Budget Guinée
                </Badge>
              </div>
            </div>
          </div>

          {/* Information ministère */}
          <div className="text-right text-sm text-gray-500">
            <p>Ministère du Budget - République de Guinée</p>
          </div>
        </div>
      </div>
    </header>
  );
};
