
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface OffersPageHeaderProps {
  onCreateOffer: () => void;
}

const OffersPageHeader: React.FC<OffersPageHeaderProps> = ({ onCreateOffer }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Gestion des offres</h1>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/admin")}>
          Retour au tableau de bord
        </Button>
        <Button onClick={onCreateOffer}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle offre
        </Button>
      </div>
    </div>
  );
};

export default OffersPageHeader;
