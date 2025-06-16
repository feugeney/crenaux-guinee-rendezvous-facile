
import React from 'react';
import { SigecSidebar } from './SigecSidebar';
import { SigecHeader } from './SigecHeader';

interface SigecLayoutProps {
  children: React.ReactNode;
}

const SigecLayout: React.FC<SigecLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SigecHeader />
      <div className="flex">
        <SigecSidebar />
        <main className="flex-1 ml-64">
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
