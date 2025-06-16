
import React, { useState } from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Calendar, 
  FileText, 
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Eye,
  Share
} from 'lucide-react';

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('juin-2024');
  const [reportType, setReportType] = useState('execution');

  const reports = [
    {
      id: 'RPT001',
      titre: 'Rapport d\'exécution budgétaire - Juin 2024',
      type: 'Exécution',
      periode: 'Juin 2024',
      dateCreation: '2024-06-30',
      statut: 'Généré',
      taille: '2.4 MB',
      format: 'PDF',
      auteur: 'Système'
    },
    {
      id: 'RPT002',
      titre: 'Analyse des dépenses par nature économique - Q2 2024',
      type: 'Analyse',
      periode: 'T2 2024',
      dateCreation: '2024-06-28',
      statut: 'En cours',
      taille: '1.8 MB',
      format: 'Excel',
      auteur: 'M. Diallo'
    },
    {
      id: 'RPT003',
      titre: 'Suivi des engagements - Mai 2024',
      type: 'Suivi',
      periode: 'Mai 2024',
      dateCreation: '2024-05-31',
      statut: 'Généré',
      taille: '1.2 MB',
      format: 'PDF',
      auteur: 'Système'
    },
    {
      id: 'RPT004',
      titre: 'Tableau de bord mensuel - Avril 2024',
      type: 'Dashboard',
      periode: 'Avril 2024',
      dateCreation: '2024-04-30',
      statut: 'Généré',
      taille: '956 KB',
      format: 'PDF',
      auteur: 'Système'
    }
  ];

  const quickStats = [
    {
      label: 'Taux d\'exécution',
      value: '57.3%',
      change: '+2.1% vs mois précédent',
      color: 'blue'
    },
    {
      label: 'Engagements en attente',
      value: '3',
      change: 'Validation requise',
      color: 'amber'
    },
    {
      label: 'Rapports générés',
      value: reports.filter(r => r.statut === 'Généré').length.toString(),
      change: 'Ce mois',
      color: 'green'
    },
    {
      label: 'Délai moyen traitement',
      value: '2.4 jours',
      change: '-0.5 jour vs moyenne',
      color: 'purple'
    }
  ];

  const chartData = [
    { name: 'Personnel', value: 60, amount: 1500000000, color: '#3B82F6' },
    { name: 'Fonctionnement', value: 25, amount: 625000000, color: '#10B981' },
    { name: 'Équipements', value: 15, amount: 375000000, color: '#F59E0B' }
  ];

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h1>
            <p className="text-gray-600">Génération et consultation des rapports budgétaires</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="juin-2024">Juin 2024</option>
              <option value="mai-2024">Mai 2024</option>
              <option value="avril-2024">Avril 2024</option>
              <option value="q2-2024">T2 2024</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 text-${stat.color}-600`}>{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Répartition des Dépenses - Juin 2024</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.value}%</p>
                      <p className="text-sm text-gray-600">
                        {new Intl.NumberFormat('fr-FR').format(item.amount)} FG
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Voir l'analyse détaillée
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Indicateurs de Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Taux d'exécution global</span>
                    <span className="text-sm font-bold text-blue-600">57.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57.3%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Délai moyen validation</span>
                    <span className="text-sm font-bold text-green-600">2.4 jours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Respect des échéances</span>
                    <span className="text-sm font-bold text-purple-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Rapports Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Titre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Période</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date création</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Format</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.titre}</p>
                          <p className="text-sm text-gray-500">ID: {report.id} • {report.taille}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{report.type}</Badge>
                      </td>
                      <td className="py-4 px-4 text-sm">{report.periode}</td>
                      <td className="py-4 px-4 text-sm">
                        {new Date(report.dateCreation).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={report.statut === 'Généré' ? 'default' : 'secondary'}>
                          {report.statut}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{report.format}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.statut === 'Généré' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Share className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SigecLayout>
  );
};

export default AdminReports;
