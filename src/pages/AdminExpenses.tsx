import React, { useState } from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const AdminExpenses = () => {
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const expenses = [
    {
      id: 'EXP001',
      date: '2024-06-15',
      beneficiaire: 'SOTELGUI',
      libelle: 'Facture télécommunications juin 2024',
      montant: 15000000,
      budgetLine: '6020 - Fournitures de bureau',
      statut: 'En attente',
      validateur: 'Contrôleur Financier',
      type: 'Engagement'
    },
    {
      id: 'EXP002',
      date: '2024-06-14',
      beneficiaire: 'EDG',
      libelle: 'Facture électricité mai 2024',
      montant: 8500000,
      budgetLine: '6020 - Fournitures de bureau',
      statut: 'Validé',
      validateur: 'Mamadou Diallo',
      type: 'Paiement'
    },
    {
      id: 'EXP003',
      date: '2024-06-13',
      beneficiaire: 'BUREAU EXPERT',
      libelle: 'Fournitures de bureau Q2 2024',
      montant: 12000000,
      budgetLine: '6020 - Fournitures de bureau',
      statut: 'Rejeté',
      validateur: 'Contrôleur Financier',
      type: 'Engagement',
      motifRejet: 'Facture incomplète'
    },
    {
      id: 'EXP004',
      date: '2024-06-12',
      beneficiaire: 'PERSONNEL',
      libelle: 'Salaires juin 2024',
      montant: 125000000,
      budgetLine: '6010 - Traitements et salaires',
      statut: 'Payé',
      validateur: 'Mamadou Diallo',
      type: 'Paiement'
    }
  ];

  const statusCounts = {
    total: expenses.length,
    enAttente: expenses.filter(e => e.statut === 'En attente').length,
    valide: expenses.filter(e => e.statut === 'Validé').length,
    paye: expenses.filter(e => e.statut === 'Payé').length,
    rejete: expenses.filter(e => e.statut === 'Rejeté').length
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente': return 'secondary';
      case 'Validé': return 'default';
      case 'Payé': return 'default';
      case 'Rejeté': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'En attente': return Clock;
      case 'Validé': return CheckCircle;
      case 'Payé': return CheckCircle;
      case 'Rejeté': return XCircle;
      default: return AlertTriangle;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FG';
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesStatus = statusFilter === 'Tous' || expense.statut === statusFilter;
    const matchesSearch = expense.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.beneficiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <SigecLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Dépenses</h1>
            <p className="text-gray-600">Suivi et validation des engagements et paiements</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle dépense
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{statusCounts.enAttente}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{statusCounts.valide}</p>
                <p className="text-sm text-gray-600">Validées</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{statusCounts.paye}</p>
                <p className="text-sm text-gray-600">Payées</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejete}</p>
                <p className="text-sm text-gray-600">Rejetées</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par libellé, bénéficiaire ou ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Validé">Validées</option>
                <option value="Payé">Payées</option>
                <option value="Rejeté">Rejetées</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Plus de filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Dépenses ({filteredExpenses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Bénéficiaire</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Libellé</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Montant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ligne budgétaire</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Statut</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => {
                    const StatusIcon = getStatusIcon(expense.statut);
                    return (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-mono text-sm">{expense.id}</td>
                        <td className="py-4 px-4 text-sm">
                          {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{expense.beneficiaire}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">{expense.libelle}</p>
                          {expense.motifRejet && (
                            <p className="text-xs text-red-600 mt-1">Motif: {expense.motifRejet}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatCurrency(expense.montant)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {expense.budgetLine}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant="outline">
                            {expense.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <StatusIcon className="h-4 w-4" />
                            <Badge variant={getStatusColor(expense.statut)}>
                              {expense.statut}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {expense.statut === 'En attente' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SigecLayout>
  );
};

export default AdminExpenses;
