
import React from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';

const AdminHRTeam = () => {
  const teamStats = [
    {
      title: 'Membres de l\'équipe',
      value: '8',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Présent aujourd\'hui',
      value: '7',
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Performance moyenne',
      value: '92%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Certifications',
      value: '24',
      icon: Award,
      color: 'orange'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sophie Laurent',
      role: 'Coach Senior',
      email: 'sophie.laurent@domconsulting.fr',
      phone: '+33 6 12 34 56 78',
      status: 'Présent',
      performance: '96%',
      specialties: ['Leadership', 'Stratégie politique']
    },
    {
      id: 2,
      name: 'Marc Dubois',
      role: 'Consultant Junior',
      email: 'marc.dubois@domconsulting.fr',
      phone: '+33 6 87 65 43 21',
      status: 'En congé',
      performance: '89%',
      specialties: ['Communication', 'Média training']
    },
    {
      id: 3,
      name: 'Emma Martin',
      role: 'Assistante Administrative',
      email: 'emma.martin@domconsulting.fr',
      phone: '+33 6 55 44 33 22',
      status: 'Présent',
      performance: '94%',
      specialties: ['Organisation', 'Support client']
    }
  ];

  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion d'équipe</h1>
            <p className="text-gray-500">Ressources humaines et performance</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Membres de l'équipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center text-xs text-gray-400">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </span>
                          <span className="flex items-center text-xs text-gray-400">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            member.status === 'Présent' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}
                        >
                          {member.status}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          Performance: {member.performance}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {member.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminHRTeam;
