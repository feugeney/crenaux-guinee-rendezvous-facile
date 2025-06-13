
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { DashboardStats } from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { UpcomingBookings } from '@/components/admin/UpcomingBookings';

const AdminDashboard = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
          </div>
          <div>
            <UpcomingBookings />
          </div>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminDashboard;
