
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Offer } from "@/services/offerService";
import OfferForm from "@/components/admin/OfferForm";

interface OfferDialogsProps {
  currentOffer: Partial<Offer> | null;
  isSubmitting: boolean;
  isDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (updatedOffer: Partial<Offer>) => void;
}

const OfferDialogs = ({
  currentOffer,
  isSubmitting,
  isDialogOpen,
  isDeleteDialogOpen,
  setIsDialogOpen,
  setIsDeleteDialogOpen,
  onSave,
  onDelete,
  onChange,
}: OfferDialogsProps) => {
  return (
    <>
      {/* Dialog de création/modification d'offre */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <OfferForm
            currentOffer={currentOffer}
            isSubmitting={isSubmitting}
            onCancel={() => setIsDialogOpen(false)}
            onSave={onSave}
            onChange={onChange}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression d'offre */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer l'offre</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'offre "{currentOffer?.title}" ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfferDialogs;
