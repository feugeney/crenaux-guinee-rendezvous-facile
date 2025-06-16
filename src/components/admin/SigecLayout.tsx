
import React, { useState } from 'react';
import { SigecSidebar } from './SigecSidebar';
import { SigecHeader } from './SigecHeader';

interface SigecLayoutProps {
  children: React.ReactNode;
}

const SigecLayout: React.FC<SigecLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <SigecHeader 
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        sidebarCollapsed={sidebarCollapsed}
      />
      <div className="flex">
        <SigecSidebar collapsed={sidebarCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SigecLayout;
