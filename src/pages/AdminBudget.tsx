
import React, { useState } from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Download, 
  Upload, 
  Edit, 
  Trash2,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';

const AdminBudget = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const budgetLines = [
    {
      id: 'BL001',
      code: '6010',
      libelle: 'Traitements et salaires du personnel',
      budgetInitial: 2500000000,
      budgetActuel: 2500000000,
      engage: 1875000000,
      disponible: 625000000,
      pourcentage: 75.0,
      statut: 'Actif'
    },
    {
      id: 'BL002',
      code: '6020',
      libelle: 'Fournitures de bureau et services',
      budgetInitial: 800000000,
      budgetActuel: 800000000,
      engage: 480000000,
      disponible: 320000000,
      pourcentage: 60.0,
      statut: 'Actif'
    },
    {
      id: 'BL003',
      code: '6030',
      libelle: 'Équipements et infrastructures',
      budgetInitial: 1200000000,
      budgetActuel: 1200000000,
      engage: 600000000,
      disponible: 600000000,
      pourcentage: 50.0,
      statut: 'Actif'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FG';
  };

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du Budget</h1>
            <p className="text-gray-600">Administration et suivi des lignes budgétaires</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="2024">Budget 2024</option>
              <option value="2023">Budget 2023</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle ligne
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Total</p>
                  <p className="text-2xl font-bold text-gray-900">4 500 000 000 FG</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Engagé</p>
                  <p className="text-2xl font-bold text-gray-900">2 955 000 000 FG</p>
                  <p className="text-sm text-green-600">65.7% du budget</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponible</p>
                  <p className="text-2xl font-bold text-gray-900">1 545 000 000 FG</p>
                  <p className="text-sm text-blue-600">34.3% du budget</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lignes Actives</p>
                  <p className="text-2xl font-bold text-gray-900">{budgetLines.length}</p>
                  <p className="text-sm text-gray-600">Sur {budgetLines.length} total</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Lines Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lignes Budgétaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Libellé</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Budget Initial</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Budget Actuel</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Engagé</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Disponible</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Exécution</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetLines.map((line) => (
                    <tr key={line.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-sm">{line.code}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{line.libelle}</p>
                          <p className="text-sm text-gray-500">ID: {line.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-sm">{formatCurrency(line.budgetInitial)}</td>
                      <td className="py-4 px-4 text-right text-sm">{formatCurrency(line.budgetActuel)}</td>
                      <td className="py-4 px-4 text-right text-sm font-medium">{formatCurrency(line.engage)}</td>
                      <td className="py-4 px-4 text-right text-sm text-green-600">{formatCurrency(line.disponible)}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${line.pourcentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{line.pourcentage}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={line.statut === 'Actif' ? 'default' : 'secondary'}>
                          {line.statut}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default AdminBudget;
