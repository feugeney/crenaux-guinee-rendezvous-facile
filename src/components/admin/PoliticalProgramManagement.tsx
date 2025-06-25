
import React from 'react';
import { ModernAdminLayout } from './ModernAdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle, FileText, Calendar } from 'lucide-react';
import { ModernActionCard } from './cards/ModernActionCard';
import { ModernStatCard } from './cards/ModernStatCard';
import { useNavigate } from 'react-router-dom';

export const PoliticalProgramManagement = () => {
  const navigate = useNavigate();

  return (
    <ModernAdminLayout 
      title="Programme Politique"
      subtitle="Gestion des candidatures et suivi des séances de coaching politique"
      showBackButton
      actions={
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Candidature
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernStatCard
            title="Candidatures Actives"
            value="28"
            icon={Users}
            trend={{ value: "+18%", direction: "up" }}
            description="En cours de traitement"
            color="blue"
          />
          <ModernStatCard
            title="En Attente"
            value="8"
            icon={FileText}
            trend={{ value: "Urgent", direction: "neutral" }}
            description="À valider"
            color="orange"
          />
          <ModernStatCard
            title="Approuvées"
            value="156"
            icon={CheckCircle}
            trend={{ value: "+22%", direction: "up" }}
            description="Candidatures validées"
            color="green"
          />
          <ModernStatCard
            title="Séances Planifiées"
            value="45"
            icon={Calendar}
            trend={{ value: "+12%", direction: "up" }}
            description="Sessions programmées"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernActionCard
            title="Validation des Candidatures"
            description="Examiner et approuver les nouvelles candidatures"
            icon={CheckCircle}
            onClick={() => navigate('/admin/political-program/applications')}
            color="green"
            urgent={true}
          />
          <ModernActionCard
            title="Suivi des Séances"
            description="Planifier et suivre les sessions de coaching"
            icon={FileText}
            onClick={() => navigate('/admin/political-program/candidates')}
            color="blue"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Nouvelle candidature approuvée</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 2 heures</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Séance de coaching planifiée</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 4 heures</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">3 candidatures en attente</span>
              </div>
              <span className="text-xs text-gray-500">Il y a 6 heures</span>
            </div>
          </div>
        </div>
      </div>
    </ModernAdashboard>
  );
};
