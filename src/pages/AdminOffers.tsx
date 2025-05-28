
import React from "react";
import { useOffersManagement } from "@/hooks/useOffersManagement";
import OffersPageHeader from "@/components/admin/OffersPageHeader";
import OffersContent from "@/components/admin/OffersContent";
import OfferDialogs from "@/components/admin/OfferDialogs";

const AdminOffers = () => {
  const {
    offers,
    isLoading,
    isSubmitting,
    currentOffer,
    isDialogOpen,
    isDeleteDialogOpen,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    handleCreateOffer,
    handleEditOffer,
    handleDeleteConfirm,
    handleSaveOffer,
    handleDeleteOffer,
    handleOfferChange,
  } = useOffersManagement();

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <OffersPageHeader onCreateOffer={handleCreateOffer} />
      
      <OffersContent
        isLoading={isLoading}
        offers={offers}
        onEdit={handleEditOffer}
        onDelete={handleDeleteConfirm}
        onCreateOffer={handleCreateOffer}
      />

      <OfferDialogs
        currentOffer={currentOffer}
        isSubmitting={isSubmitting}
        isDialogOpen={isDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onSave={handleSaveOffer}
        onDelete={handleDeleteOffer}
        onChange={handleOfferChange}
      />
    </div>
  );
};

export default AdminOffers;
