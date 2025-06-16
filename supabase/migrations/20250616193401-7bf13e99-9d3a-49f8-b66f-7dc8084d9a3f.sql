
-- Créer une table pour les paramètres système
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les logs d'activité système
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les sessions utilisateur
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- Créer une table pour les notifications système
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, warning, error, success
  target_users TEXT[] DEFAULT '{}', -- IDs des utilisateurs ciblés, vide = tous
  is_read BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Créer une table pour les sauvegardes
CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL, -- manual, automatic
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  file_size BIGINT,
  file_path TEXT,
  created_by UUID REFERENCES auth.users(id),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Insérer des paramètres système par défaut
INSERT INTO public.system_settings (key, value, description, category) VALUES
('app_name', 'SIG-Budget Guinée', 'Nom de l''application', 'general'),
('app_version', '1.0.0', 'Version de l''application', 'general'),
('maintenance_mode', 'false', 'Mode maintenance activé', 'system'),
('backup_frequency', '6', 'Fréquence des sauvegardes en heures', 'system'),
('session_timeout', '8', 'Durée de session en heures', 'security'),
('max_login_attempts', '5', 'Nombre maximum de tentatives de connexion', 'security'),
('email_notifications', 'true', 'Notifications par email activées', 'notifications'),
('system_email', 'admin@budget.gov.gn', 'Email système', 'notifications')
ON CONFLICT (key) DO NOTHING;

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour system_settings (seuls les admins peuvent modifier)
CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Politiques RLS pour activity_logs (seuls les admins peuvent voir tous les logs)
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid());

-- Politiques RLS pour user_sessions
CREATE POLICY "Admins can manage all sessions" ON public.user_sessions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (user_id = auth.uid());

-- Politiques RLS pour system_notifications
CREATE POLICY "Admins can manage notifications" ON public.system_notifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view targeted notifications" ON public.system_notifications
  FOR SELECT USING (
    target_users = '{}' OR auth.uid()::text = ANY(target_users)
  );

-- Politiques RLS pour backup_logs
CREATE POLICY "Admins can manage backup logs" ON public.backup_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Fonction pour enregistrer les activités
CREATE OR REPLACE FUNCTION public.log_activity(
  action_name TEXT,
  resource_type_param TEXT DEFAULT NULL,
  resource_id_param TEXT DEFAULT NULL,
  details_param JSONB DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    action_name,
    resource_type_param,
    resource_id_param,
    details_param
  );
END;
$$;

-- Trigger pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables qui ont updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
