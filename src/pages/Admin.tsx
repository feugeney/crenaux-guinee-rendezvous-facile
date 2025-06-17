
import React from 'react';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Admin = () => {
  return (
    <AdminAuth>
      <AdminDashboard />
    </AdminAuth>
  );
};

export default Admin;
