
-- Create the offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add update trigger for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- Enable Row Level Security
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admin roles would be better with proper auth)
CREATE POLICY "Allow all operations for authenticated users" ON public.offers
  FOR ALL
  USING (true);

-- Add initial offers if needed
INSERT INTO public.offers (title, description, price, is_featured)
VALUES 
('Entretien en privé', 'Une séance unique pendant 30 minutes en tête en tête autour de votre projet politique ou professionnel.', 300, true),
('Programme "Je m''affirme"', 'Faites décoller votre carrière avec un accompagnement coaching sur mesure. Durée : 1 mois et 2 semaines de suivi post-coaching.', 1200, true),
('Programme "Lancement politique"', 'Entrée en politique avec méthode, audace et impact. Durée: 6 séances intensives + une feuille de route et 2 semaines de suivi post-coaching.', 1500, true);
