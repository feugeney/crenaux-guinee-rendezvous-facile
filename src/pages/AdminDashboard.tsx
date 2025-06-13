
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
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
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminDashboard;
