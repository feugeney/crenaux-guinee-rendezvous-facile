
import React from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import ModernDashboardOverview from '@/components/admin/ModernDashboardOverview';
import DashboardUpcomingBookings from '@/components/admin/DashboardUpcomingBookings';

const AdminDashboard = () => {
  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Vue d'ensemble moderne */}
        <ModernDashboardOverview />
        
        {/* Prochains rendez-vous */}
        <DashboardUpcomingBookings />
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDashboard;
