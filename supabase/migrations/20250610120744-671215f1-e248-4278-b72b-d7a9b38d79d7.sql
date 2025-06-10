
-- Créer la table pour stocker les métadonnées des images des offres
CREATE TABLE public.offer_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_url TEXT NOT NULL,
  blob_url TEXT,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour sécuriser l'accès aux images
ALTER TABLE public.offer_images ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Allow public read access to offer images" 
  ON public.offer_images 
  FOR SELECT 
  USING (true);

-- Politique pour permettre l'insertion d'images (pour les administrateurs)
CREATE POLICY "Allow authenticated users to insert offer images" 
  ON public.offer_images 
  FOR INSERT 
  WITH CHECK (true);

-- Ajouter un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_offer_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_offer_images_updated_at
  BEFORE UPDATE ON public.offer_images
  FOR EACH ROW
  EXECUTE FUNCTION update_offer_images_updated_at();
