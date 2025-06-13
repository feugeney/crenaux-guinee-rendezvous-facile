
import React, { useState } from 'react';
import AdminHorizontalLayout from '@/components/admin/AdminHorizontalLayout';
import OffersPageHeader from '@/components/admin/OffersPageHeader';
import OffersContent from '@/components/admin/OffersContent';

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
      <div className="space-y-6">
        <OffersPageHeader onCreateOffer={handleCreateOffer} />
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
