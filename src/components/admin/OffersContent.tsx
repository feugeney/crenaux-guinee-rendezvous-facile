
import React from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OffersTable from "@/components/admin/OffersTable";
import { Offer } from "@/services/offerService";

interface OffersContentProps {
  isLoading: boolean;
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
  onCreateOffer: () => void;
}

const OffersContent: React.FC<OffersContentProps> = ({
  isLoading,
  offers,
  onEdit,
  onDelete,
  onCreateOffer,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offres</CardTitle>
        <CardDescription>
          Gérez les offres qui apparaissent sur la page d'accueil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : offers.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Aucune offre trouvée.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onCreateOffer}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Créer une offre
            </Button>
          </div>
        ) : (
          <OffersTable
            offers={offers}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OffersContent;
