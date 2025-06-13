
import React, { useState } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import OffersPageHeader from '@/components/admin/OffersPageHeader';
import OffersContent from '@/components/admin/OffersContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Eye, Plus } from 'lucide-react';

const AdminOffers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [offers, setOffers] = useState([]);

  const handleCreateOffer = () => {
    console.log('Create offer clicked');
    // TODO: Implémenter la création d'offre
  };

  const handleEditOffer = (offer: any) => {
    console.log('Edit offer:', offer);
    // TODO: Implémenter l'édition d'offre
  };

  const handleDeleteOffer = (offer: any) => {
    console.log('Delete offer:', offer);
    // TODO: Implémenter la suppression d'offre
  };

  return (
    <AdminHorizontalLayout>
      <div className="space-y-8">
        {/* Header moderne */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                  Gestion des offres
                </h1>
                <p className="text-gray-600">Créez et gérez vos offres de coaching</p>
              </div>
            </div>
          </div>
          <OffersPageHeader onCreateOffer={handleCreateOffer} />
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Offres actives</p>
                  <p className="text-2xl font-bold text-blue-900">{offers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Conversions</p>
                  <p className="text-2xl font-bold text-green-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Vues totales</p>
                  <p className="text-2xl font-bold text-purple-900">2.4K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <OffersContent 
          isLoading={isLoading}
          offers={offers}
          onEdit={handleEditOffer}
          onDelete={handleDeleteOffer}
          onCreateOffer={handleCreateOffer}
        />
      </div>
    </AdminHorizontalLayout>
  );
};

export default AdminOffers;
