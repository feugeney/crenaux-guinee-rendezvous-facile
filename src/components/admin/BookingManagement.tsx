
import React from 'react';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { BookingsViewTabs } from './bookings/BookingsViewTabs';
import { BookingsStats } from './bookings/BookingsStats';
import { useBookings } from './bookings/useBookings';
import { ModernStatCard } from './cards/ModernStatCard';

export const BookingManagement = () => {
  const { bookings, loading } = useBookings();

  return (
    <ModernAdminLayout 
      title="Gestion des Réservations"
      subtitle="Gérez toutes les réservations et rendez-vous"
      showBackButton
      actions={
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Réservation
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Modern Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernStatCard
            title="Total Réservations"
            value={bookings.length}
            icon={Calendar}
            trend={{ value: "+12%", direction: "up" }}
            description="Toutes les réservations"
            color="blue"
          />
          <ModernStatCard
            title="Réservations Express"
            value={bookings.filter(b => b.is_priority).length}
            icon={Clock}
            trend={{ value: "+25%", direction: "up" }}
            description="Traitement prioritaire"
            color="orange"
          />
          <ModernStatCard
            title="Réservations Standard"
            value={bookings.filter(b => !b.is_priority).length}
            icon={CheckCircle}
            trend={{ value: "+8%", direction: "up" }}
            description="Traitement normal"
            color="green"
          />
          <ModernStatCard
            title="Confirmées Aujourd'hui"
            value="12"
            icon={Calendar}
            trend={{ value: "+15%", direction: "up" }}
            description="Rendez-vous du jour"
            color="purple"
          />
        </div>

        {/* Bookings View */}
        <BookingsViewTabs filteredBookings={bookings} />
      </div>
    </ModernAdminLayout>
  );
};
