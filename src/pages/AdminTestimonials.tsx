
import React from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import TestimonialsAdmin from '@/components/admin/TestimonialsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const AdminTestimonials = () => {
  return (
    <AdminHorizontalLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des témoignages</h1>
            <p className="text-gray-600 mt-2">Approuvez et gérez les témoignages clients</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Témoignages clients</CardTitle>
            <CardDescription>
              Validez et modérez les témoignages avant publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestimonialsAdmin />
          </CardContent>
        </Card>
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminTestimonials;
