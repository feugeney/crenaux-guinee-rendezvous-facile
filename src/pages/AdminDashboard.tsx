
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import ModernDashboardHeader from '@/components/admin/ModernDashboardHeader';
import ModernDashboardStats from '@/components/admin/ModernDashboardStats';
import ModernDashboardGrid from '@/components/admin/ModernDashboardGrid';

const AdminDashboard = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* En-tête moderne avec animations */}
        <ModernDashboardHeader />
        
        {/* Statistiques avec design moderne */}
        <ModernDashboardStats />
        
        {/* Grille de contenu moderne */}
        <ModernDashboardGrid />
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminDashboard;
