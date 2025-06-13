
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import { OffersPageHeader } from '@/components/admin/OffersPageHeader';
import { OffersContent } from '@/components/admin/OffersContent';

const AdminOffers = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <OffersPageHeader />
        <OffersContent />  
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminOffers;
