
import React from 'react';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock } from 'lucide-react';
import { TimeSlotList } from './time-slots/TimeSlotList';
import { ModernStatCard } from './cards/ModernStatCard';

export const TimeSlotManagement = () => {
  return (
    <ModernAdminLayout 
      title="Gestion des Créneaux Horaires"
      subtitle="Gérez vos disponibilités et créneaux de consultation"
      showBackButton
      actions={
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Créneau
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModernStatCard
            title="Créneaux Actifs"
            value="24"
            icon={Calendar}
            trend={{ value: "+12%", direction: "up" }}
            description="Créneaux disponibles"
            color="blue"
          />
          <ModernStatCard
            title="Créneaux Bloqués"
            value="3"
            icon={Clock}
            trend={{ value: "-5%", direction: "down" }}
            description="Temporairement indisponibles"
            color="orange"
          />
          <ModernStatCard
            title="Taux d'Occupation"
            value="87%"
            icon={Calendar}
            trend={{ value: "+8%", direction: "up" }}
            description="Utilisation des créneaux"
            color="green"
          />
        </div>

        {/* Time Slots List */}
        <TimeSlotList />
      </div>
    </ModernAdminLayout>
  );
};
