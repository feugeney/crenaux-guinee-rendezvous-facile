
import React from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import PoliticalApplicationsList from '@/components/admin/PoliticalApplicationsList';

const AdminPoliticalLaunch = () => {
  return (
    <AdminDashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <PoliticalApplicationsList />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPoliticalLaunch;
