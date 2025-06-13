
import React from 'react';
import { AdminHorizontalNav } from './AdminHorizontalNav';
import AdminAuthGuard from './AdminAuthGuard';

interface AdminHorizontalLayoutProps {
  children: React.ReactNode;
}

const AdminHorizontalLayout: React.FC<AdminHorizontalLayoutProps> = ({ children }) => {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <AdminHorizontalNav />
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminHorizontalLayout;
