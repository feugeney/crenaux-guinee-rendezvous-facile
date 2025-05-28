
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/hooks/use-toast";

const offerSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(1, {
    message: "Price must be at least 1.",
  }),
  image_url: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

interface AddEditOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: any;
  onConfirm: (values: z.infer<typeof offerSchema>) => Promise<void>;
}

interface DeleteOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string;
  onConfirm: () => Promise<void>;
}

export function AddEditOfferDialog({ open, onOpenChange, offer, onConfirm }: AddEditOfferDialogProps) {
  const { toast } = useToast();
  
  // Simple refresh function since we don't have access to useDashboard anymore
  const refresh = () => {
    window.location.reload();
  };
  
  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      price: offer?.price || 0,
      image_url: offer?.image_url || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleConfirm = async () => {
    try {
      if (isLoading) return;

      form.trigger().then(async (isValid) => {
        if (!isValid) {
          toast({
            title: "Erreur",
            description: "Veuillez vérifier que tous les champs sont valides.",
            variant: "destructive",
          });
          return;
        }
      });
      
      // Convert the handleSubmit to return a Promise
      await new Promise<void>((resolve) => {
        handleSubmit(async (values) => {
          await onConfirm(values);
          resolve();
        })();
      });
      
      form.reset();
      onOpenChange(false);
      refresh();
      toast({
        title: "Succès",
        description: "Offre enregistrée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'offre.",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = (callback: (values: z.infer<typeof offerSchema>) => Promise<void>) => {
    return async () => {
      if (isLoading) return;
  
      try {
        const isValid = await form.trigger();
        if (!isValid) {
          toast({
            title: "Erreur",
            description: "Veuillez vérifier que tous les champs sont valides.",
            variant: "destructive",
          });
          return;
        }
  
        const values = form.getValues();
        await callback(values);
  
        form.reset();
        onOpenChange(false);
        refresh();
        toast({
          title: "Succès",
          description: "Offre enregistrée avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de l'offre.",
          variant: "destructive",
        });
      }
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{offer ? "Modifier l'offre" : "Ajouter une offre"}</DialogTitle>
          <DialogDescription>
            {offer ? "Modifier les détails de l'offre." : "Créer une nouvelle offre."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de l'offre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description de l'offre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Prix de l'offre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de l'image</FormLabel>
                <FormControl>
                  <Input placeholder="URL de l'image" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter>
          <Button type="submit" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteOfferDialog({ open, onOpenChange, offerId, onConfirm }: DeleteOfferDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // Simple refresh function 
  const refresh = () => {
    window.location.reload();
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
      refresh();
      toast({
        title: "Succès",
        description: "Offre supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'offre.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'offre</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Combined component for AdminOffers page import
const OfferDialogs = ({ 
  currentOffer, 
  isSubmitting, 
  isDialogOpen, 
  isDeleteDialogOpen, 
  setIsDialogOpen, 
  setIsDeleteDialogOpen, 
  onSave, 
  onDelete, 
  onChange 
}) => {
  return (
    <>
      <AddEditOfferDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        offer={currentOffer} 
        onConfirm={onSave} 
      />
      <DeleteOfferDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen} 
        offerId={currentOffer?.id} 
        onConfirm={onDelete} 
      />
    </>
  );
};

export default OfferDialogs;
