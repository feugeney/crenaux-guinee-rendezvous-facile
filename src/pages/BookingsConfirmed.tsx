
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { BookingManagement } from '@/components/admin/BookingManagement';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

const BookingsConfirmed = () => {
  return (
    <AdminAuthGuard>
      <SigecLayout>
        <BookingManagement />
      </SigecLayout>
    </AdminAuthGuard>
  );
};

export default BookingsConfirmed;
