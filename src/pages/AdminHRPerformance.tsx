
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Award, 
  Target,
  Users,
  Star,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';

const AdminHRPerformance = () => {
  const performanceStats = [
    { title: 'Performance moyenne', value: '92%', icon: TrendingUp, color: 'green' },
    { title: 'Objectifs atteints', value: '85%', icon: Target, color: 'blue' },
    { title: 'Évaluations complétées', value: '12', icon: Award, color: 'purple' },
    { title: 'Plans d\'amélioration', value: '3', icon: BarChart3, color: 'orange' }
  ];

  const teamPerformance = [
    {
      name: 'Dr. Sophie Laurent',
      role: 'Coach Senior',
      performance: 96,
      objectives: 9,
      completed: 8,
      rating: 5,
      improvement: '+4%'
    },
    {
      name: 'Marc Dubois',
      role: 'Consultant Junior',
      performance: 89,
      objectives: 8,
      completed: 6,
      rating: 4,
      improvement: '+2%'
    },
    {
      name: 'Emma Martin',
      role: 'Assistante Administrative',
      performance: 94,
      objectives: 6,
      completed: 6,
      rating: 5,
      improvement: '+6%'
    },
    {
      name: 'Pierre Diallo',
      role: 'Coach Junior',
      performance: 87,
      objectives: 7,
      completed: 5,
      rating: 4,
      improvement: '-1%'
    }
  ];

  const objectives = [
    {
      title: 'Augmenter la satisfaction client',
      assignee: 'Équipe complète',
      target: 95,
      current: 92,
      deadline: '2024-03-31'
    },
    {
      title: 'Réduire le temps de réponse',
      assignee: 'Service client',
      target: 2,
      current: 3.2,
      deadline: '2024-02-28'
    },
    {
      title: 'Formation continue',
      assignee: 'Tous les coachs',
      target: 40,
      current: 32,
      deadline: '2024-06-30'
    }
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (performance >= 85) return <Badge className="bg-blue-100 text-blue-800">Très bien</Badge>;
    if (performance >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Bien</Badge>;
    return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>;
  };

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance de l'Équipe</h1>
            <p className="text-gray-600">Suivi des performances et objectifs</p>
          </div>
          <div className="space-x-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Période
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat) => {
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
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Performance Individuelle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member) => (
                  <div key={member.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      {getPerformanceBadge(member.performance)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        <p className="text-xl font-bold text-gray-900">{member.performance}%</p>
                        <p className={`text-xs ${
                          member.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {member.improvement}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Objectifs</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {member.completed}/{member.objectives}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {getRatingStars(member.rating)}
                      </div>
                      <span className="text-sm text-gray-500">Évaluation</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Objectifs d'Équipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {objectives.map((objective, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900">{objective.title}</h3>
                      <p className="text-sm text-gray-500">{objective.assignee}</p>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">
                          {objective.current} / {objective.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(objective.current / objective.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Échéance: {objective.deadline}</span>
                      <Badge variant="outline">
                        {Math.round((objective.current / objective.target) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SigecLayout>
  );
};

export default AdminHRPerformance;
