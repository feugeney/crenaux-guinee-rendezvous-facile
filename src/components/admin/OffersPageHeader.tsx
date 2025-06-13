
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft } from "lucide-react";

interface OffersPageHeaderProps {
  onCreateOffer: () => void;
}

const OffersPageHeader: React.FC<OffersPageHeaderProps> = ({ onCreateOffer }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={() => navigate("/admin")}
        className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> 
        Dashboard
      </Button>
      <Button 
        onClick={onCreateOffer}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> 
        Nouvelle offre
      </Button>
    </div>
  );
};

export default OffersPageHeader;
