
import React from 'react';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import TestimonialsAdmin from '@/components/admin/TestimonialsAdmin';

const AdminTestimonials = () => {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des témoignages</h1>
            <p className="text-gray-600 mt-2">
              Gérez et modérez les témoignages clients
            </p>
          </div>
        </div>

        <TestimonialsAdmin />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminTestimonials;
