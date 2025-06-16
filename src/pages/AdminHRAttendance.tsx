
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react';

const AdminHRAttendance = () => {
  const attendanceStats = [
    { title: 'Présent aujourd\'hui', value: '7/8', icon: CheckCircle, color: 'green' },
    { title: 'Retards ce mois', value: '3', icon: Clock, color: 'yellow' },
    { title: 'Absences ce mois', value: '5', icon: XCircle, color: 'red' },
    { title: 'Taux de présence', value: '94%', icon: Users, color: 'blue' }
  ];

  const todayAttendance = [
    {
      name: 'Dr. Sophie Laurent',
      arrival: '08:45',
      departure: '17:30',
      status: 'Présent',
      workHours: '8h45'
    },
    {
      name: 'Marc Dubois',
      arrival: '09:15',
      departure: '--',
      status: 'Présent',
      workHours: 'En cours'
    },
    {
      name: 'Emma Martin',
      arrival: '08:30',
      departure: '17:00',
      status: 'Présent',
      workHours: '8h30'
    },
    {
      name: 'Pierre Diallo',
      arrival: '--',
      departure: '--',
      status: 'Absent',
      workHours: '0h'
    }
  ];

  const weeklyAttendance = [
    { day: 'Lundi', present: 8, absent: 0, late: 1 },
    { day: 'Mardi', present: 7, absent: 1, late: 0 },
    { day: 'Mercredi', present: 8, absent: 0, late: 2 },
    { day: 'Jeudi', present: 6, absent: 2, late: 0 },
    { day: 'Vendredi', present: 7, absent: 1, late: 1 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Présent':
        return <Badge className="bg-green-100 text-green-800">Présent</Badge>;
      case 'Absent':
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case 'Retard':
        return <Badge className="bg-yellow-100 text-yellow-800">Retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Présences</h1>
            <p className="text-gray-600">Suivi des horaires et présences de l'équipe</p>
          </div>
          <div className="space-x-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attendanceStats.map((stat) => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Présences du Jour</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAttendance.map((person) => (
                  <div key={person.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{person.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Arrivée: {person.arrival}</span>
                        <span>Départ: {person.departure}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(person.status)}
                      <p className="text-sm text-gray-600 mt-1">{person.workHours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Résumé Hebdomadaire</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyAttendance.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{day.day}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">{day.present} présents</span>
                        {day.absent > 0 && (
                          <span className="text-red-600">{day.absent} absents</span>
                        )}
                        {day.late > 0 && (
                          <span className="text-yellow-600">{day.late} retards</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(day.present / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertes Présences</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Retard fréquent détecté</p>
                    <p className="text-sm text-gray-600">Marc Dubois - 3 retards cette semaine</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Voir détails</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Absence non justifiée</p>
                    <p className="text-sm text-gray-600">Pierre Diallo - Absent depuis 2 jours</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Contacter</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SigecLayout>
  );
};

export default AdminHRAttendance;
