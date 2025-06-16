
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { PoliticalLaunchManagement } from '@/components/admin/PoliticalLaunchManagement';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

const PoliticalLaunchAdmin = () => {
  return (
    <AdminAuthGuard>
      <SigecLayout>
        <PoliticalLaunchManagement />
      </SigecLayout>
    </AdminAuthGuard>
  );
};

export default PoliticalLaunchAdmin;
