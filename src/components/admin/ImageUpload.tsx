
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

const ImageUpload = ({ value, onChange, label = "Image" }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Créer une URL blob pour afficher l'image immédiatement
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      
      // Convertir le fichier en base64 pour le stockage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        
        toast({
          title: "Image uploadée",
          description: "L'image a été uploadée avec succès",
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Erreur",
          description: "Impossible de lire l'image",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    // Nettoyer l'URL blob si c'en est une
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');
    onChange('');
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              // En cas d'erreur de chargement, afficher l'image par défaut
              (e.target as HTMLImageElement).src = "/lovable-uploads/f653ae10-5515-4866-88c7-0173d547d222.png";
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucune image sélectionnée</p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <Label htmlFor="image-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            asChild
          >
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Upload en cours...' : 'Choisir une image'}
            </span>
          </Button>
        </Label>
        
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Ou saisissez une URL d'image"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
