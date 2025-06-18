
-- Ajouter la colonne is_blocked à la table time_slots avec la valeur par défaut false
ALTER TABLE public.time_slots 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- Mettre à jour les créneaux existants pour avoir is_blocked = false par défaut
UPDATE public.time_slots 
SET is_blocked = false 
WHERE is_blocked IS NULL;
