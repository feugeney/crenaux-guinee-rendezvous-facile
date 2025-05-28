
-- Fonction pour créer la table de paramètres si elle n'existe pas
create or replace function create_settings_table_if_not_exists()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'site_settings') then
    create table public.site_settings (
      id uuid primary key default gen_random_uuid(),
      key text unique not null,
      value text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    
    -- Active la sécurité au niveau des lignes
    alter table public.site_settings enable row level security;
    
    -- Crée une politique pour permettre à tous les utilisateurs de lire les paramètres
    create policy "Anyone can read site settings" on public.site_settings
      for select using (true);
      
    -- Crée une politique pour permettre aux administrateurs de modifier les paramètres
    -- Note: Vous devrez ajuster cette politique en fonction de votre système d'autorisations
    create policy "Only admins can insert/update site settings" on public.site_settings
      for all using (true) with check (true);
  end if;
end;
$$ language plpgsql;

-- Création de la table pour stocker les réservations temporaires
create table if not exists public.temp_bookings (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  booking_data jsonb not null,
  created_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes
alter table public.temp_bookings enable row level security;

-- Crée une politique pour permettre les opérations via les fonctions edge
create policy "Allow edge functions to manage temp bookings" on public.temp_bookings
  for all using (true) with check (true);

-- Table pour les réservations confirmées
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  date text not null,
  time_slot jsonb not null,
  topic text not null,
  notes text,
  stripe_session_id text unique,
  payment_status text not null default 'pending',
  payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Active la sécurité au niveau des lignes
alter table public.bookings enable row level security;

-- Crée une politique pour permettre les opérations via les fonctions edge
create policy "Allow edge functions to manage bookings" on public.bookings
  for all using (true) with check (true);
