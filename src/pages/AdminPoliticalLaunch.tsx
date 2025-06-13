
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import PoliticalLaunchCard from '@/components/admin/PoliticalLaunchCard';
import PoliticalApplicationsList from '@/components/admin/PoliticalApplicationsList';

const AdminPoliticalLaunch = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programme "Je me lance en politique"</h1>
          <p className="text-gray-600 mt-2">Gestion des candidatures et du programme VIP</p>
        </div>
        
        <PoliticalLaunchCard />
        <PoliticalApplicationsList />
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminPoliticalLaunch;
