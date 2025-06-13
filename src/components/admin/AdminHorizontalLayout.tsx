
import React from 'react';
import { AdminHorizontalNav } from './AdminHorizontalNav';

interface AdminHorizontalLayoutProps {
  children: React.ReactNode;
}

const AdminHorizontalLayout: React.FC<AdminHorizontalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminHorizontalNav />
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminHorizontalLayout;
