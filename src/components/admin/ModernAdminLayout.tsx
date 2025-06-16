
import React from 'react';
import { ModernAdminSidebar } from './ModernAdminSidebar';
import AdminAuthGuard from './AdminAuthGuard';

interface ModernAdminLayoutProps {
  children: React.ReactNode;
}

const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ children }) => {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex">
          <ModernAdminSidebar />
          <main className="flex-1 ml-72">
            <div className="p-8">
              <div className="max-w-7xl mx-auto space-y-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default ModernAdminLayout;
