
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';
import UpcomingBookings from '@/components/admin/UpcomingBookings';
import BookingsCalendar from '@/components/admin/BookingsCalendar';

const AdminDashboard = () => {
  return (
    <AdminHorizontalLayout>
      <DashboardHeader />
      
      <div className="space-y-8">
        <DashboardStats />
        
        {/* Calendrier des rendez-vous - Section principale */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calendrier des rendez-vous</h2>
          <BookingsCalendar />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <QuickActions />
          </div>
          
          <div className="space-y-8">
            <UpcomingBookings />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminDashboard;
