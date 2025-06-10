
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Offer } from "@/services/offerService";
import EnhancedImageUpload from "@/components/admin/EnhancedImageUpload";

interface OfferFormProps {
  currentOffer: Partial<Offer> | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChange: (updatedOffer: Partial<Offer>) => void;
}

const CATEGORY_OPTIONS = [
  { value: "coaching", label: "Coaching" },
  { value: "formation", label: "Formation" },
  { value: "consultation", label: "Consultation" },
  { value: "masterclass", label: "Masterclass" },
  { value: "other", label: "Autre" },
];

const OfferForm = ({
  currentOffer,
  isSubmitting,
  onCancel,
  onSave,
  onChange,
}: OfferFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left">
          {currentOffer?.id ? "Modifier l'offre" : "Créer une offre"}
        </DialogTitle>
        <DialogDescription className="text-left">
          {currentOffer?.id
            ? "Modifiez les détails de cette offre."
            : "Remplissez les détails pour créer une nouvelle offre."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
          <Label htmlFor="title" className="text-left">Titre *</Label>
          <Input
            id="title"
            value={currentOffer?.title || ""}
            onChange={(e) =>
              onChange({ ...currentOffer!, title: e.target.value })
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-left">Description *</Label>
          <Textarea
            id="description"
            value={currentOffer?.description || ""}
            rows={4}
            onChange={(e) =>
              onChange({ ...currentOffer!, description: e.target.value })
            }
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category" className="text-left">Catégorie</Label>
          <Select 
            value={currentOffer?.category || "coaching"} 
            onValueChange={(value) => onChange({ ...currentOffer!, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price" className="text-left">Prix (€)</Label>
          <Input
            id="price"
            type="number"
            value={currentOffer?.price || 0}
            onChange={(e) =>
              onChange({ ...currentOffer!, price: Number(e.target.value) })
            }
          />
        </div>
        <div className="grid gap-2">
          <EnhancedImageUpload
            value={currentOffer?.image_url || ""}
            onChange={(imageUrl) =>
              onChange({ ...currentOffer!, image_url: imageUrl })
            }
            label="Image de l'offre"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={currentOffer?.featured || false}
            onCheckedChange={(checked) =>
              onChange({ ...currentOffer!, featured: checked })
            }
          />
          <Label htmlFor="featured" className="text-left">Mettre en avant sur la page d'accueil</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {currentOffer?.id ? "Mettre à jour" : "Créer"}
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default OfferForm;
