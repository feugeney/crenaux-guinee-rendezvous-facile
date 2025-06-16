
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { TimeSlotManagement } from '@/components/admin/TimeSlotManagement';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

const TimeSlots = () => {
  return (
    <AdminAuthGuard>
      <SigecLayout>
        <TimeSlotManagement />
      </SigecLayout>
    </AdminAuthGuard>
  );
};

export default TimeSlots;
