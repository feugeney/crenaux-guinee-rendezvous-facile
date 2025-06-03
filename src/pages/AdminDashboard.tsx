
import React from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';
import PoliticalLaunchCard from '@/components/admin/PoliticalLaunchCard';

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <RecentActivity />
          </div>
          
          <div className="space-y-6">
            <PoliticalLaunchCard />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
