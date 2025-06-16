
import React from 'react';
import SigecLayout from '@/components/admin/SigecLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Plus, 
  Download,
  Eye,
  Edit,
  Send,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminAccountingInvoices = () => {
  const invoiceStats = [
    { title: 'Factures émises', value: '156', icon: Receipt, color: 'blue' },
    { title: 'En attente de paiement', value: '12', icon: Clock, color: 'yellow' },
    { title: 'Payées', value: '142', icon: CheckCircle, color: 'green' },
    { title: 'En retard', value: '2', icon: AlertCircle, color: 'red' }
  ];

  const invoices = [
    {
      id: 'INV-2024-001',
      client: 'Marie Dubois',
      service: 'Coaching individuel',
      amount: 250,
      date: '2024-01-15',
      dueDate: '2024-02-14',
      status: 'Payée'
    },
    {
      id: 'INV-2024-002',
      client: 'Jean Martin',
      service: 'Formation leadership',
      amount: 180,
      date: '2024-01-14',
      dueDate: '2024-02-13',
      status: 'En attente'
    },
    {
      id: 'INV-2024-003',
      client: 'Sophie Laurent',
      service: 'Consultation stratégique',
      amount: 320,
      date: '2024-01-13',
      dueDate: '2024-02-12',
      status: 'Payée'
    },
    {
      id: 'INV-2024-004',
      client: 'Pierre Diallo',
      service: 'Lancement politique',
      amount: 1500,
      date: '2024-01-10',
      dueDate: '2024-02-09',
      status: 'En retard'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payée':
        return <Badge className="bg-green-100 text-green-800">Payée</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'En retard':
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Factures</h1>
            <p className="text-gray-600">Création et suivi des factures clients</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {invoiceStats.map((stat) => {
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

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Factures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">N° Facture</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date d'émission</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Échéance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{invoice.id}</td>
                      <td className="py-3 px-4">{invoice.client}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.service}</td>
                      <td className="py-3 px-4 font-semibold">€{invoice.amount}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                      <td className="py-3 px-4 text-gray-600">{invoice.dueDate}</td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'En attente' && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
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

export default AdminAccountingInvoices;
