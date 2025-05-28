
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Offer, fetchOffers, createOffer, updateOffer, deleteOffer } from "@/services/offerService";
import { supabase } from "@/lib/supabase";

export const useOffersManagement = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<Offer> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOffers();
      console.log("Admin offers fetched:", data);
      setOffers(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOffer = () => {
    setCurrentOffer({
      title: "",
      description: "",
      price: 0,
      image_url: "",
      featured: true,
      category: "coaching"
    });
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setCurrentOffer(offer);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (offer: Offer) => {
    setCurrentOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveOffer = async () => {
    if (!currentOffer?.title || !currentOffer?.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentOffer.id) {
        // Update existing offer
        await updateOffer(currentOffer.id, currentOffer);
        toast({
          title: "Succès",
          description: "L'offre a été mise à jour avec succès",
        });
      } else {
        // Create new offer
        await createOffer(currentOffer);
        toast({
          title: "Succès",
          description: "L'offre a été créée avec succès",
        });
      }
      
      setIsDialogOpen(false);
      await loadOffers();
    } catch (error: any) {
      console.error("Error saving offer:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async () => {
    if (!currentOffer?.id) return;
    
    setIsSubmitting(true);
    try {
      await deleteOffer(currentOffer.id);
      toast({
        title: "Supprimé",
        description: "L'offre a été supprimée avec succès",
      });
      
      setIsDeleteDialogOpen(false);
      await loadOffers();
    } catch (error: any) {
      console.error("Error deleting offer:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferChange = (updatedOffer: Partial<Offer>) => {
    setCurrentOffer(updatedOffer);
  };

  return {
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
  };
};
