
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';
import UpcomingBookings from '@/components/admin/UpcomingBookings';

const AdminDashboard = () => {
  return (
    <AdminHorizontalLayout>
      <DashboardHeader />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <DashboardStats />
          <QuickActions />
        </div>
        
        <div className="space-y-8">
          <UpcomingBookings />
          <RecentActivity />
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminDashboard;
