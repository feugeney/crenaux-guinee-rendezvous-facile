
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  payment_option: string;
  payment_method: string;
  format_preference: string;
  start_period: string;
  preferred_start_date?: string;
  // ... autres champs
}

const AdminPoliticalLaunchSchedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [application, setApplication] = useState<PoliticalApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Planning state - Changé de 6 à 8 séances
  const [startDate, setStartDate] = useState<Date>();
  const [sessionDates, setSessionDates] = useState<Date[]>([]);
  const [followUpStartDate, setFollowUpStartDate] = useState<Date>();
  const [followUpEndDate, setFollowUpEndDate] = useState<Date>();
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la candidature",
        variant: "destructive",
      });
      navigate('/admin/political-launch');
    } finally {
      setIsLoading(false);
    }
  };

  const addSessionDate = () => {
    if (sessionDates.length < 8) { // Changé de 6 à 8
      setSessionDates([...sessionDates, new Date()]);
    }
  };

  const updateSessionDate = (index: number, date: Date | undefined) => {
    if (date) {
      const newDates = [...sessionDates];
      newDates[index] = date;
      setSessionDates(newDates);
    }
  };

  const removeSessionDate = (index: number) => {
    setSessionDates(sessionDates.filter((_, i) => i !== index));
  };

  const generatePaymentLink = async () => {
    const price = getPrice(application!.payment_option);
    const paymentData = {
      bookingData: {
        topic: "Programme Je me lance en politique",
        fullName: application!.full_name,
        email: application!.email,
        phone: application!.phone,
      },
      productPrice: price * 100, // Convert to cents for Stripe
    };

    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: paymentData
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Erreur génération lien paiement:', error);
      return `${window.location.origin}/payment?amount=${price}&client=${application!.full_name}`;
    }
  };

  const handleSaveSchedule = async () => {
    if (!application || !startDate || sessionDates.length !== 8 || !followUpStartDate || !followUpEndDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis (8 séances + période de suivi)",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Générer le lien de paiement
      const paymentLink = await generatePaymentLink();

      const scheduleData = {
        program_start_date: startDate.toISOString(),
        intensive_sessions: sessionDates.map(date => date.toISOString()),
        follow_up_start: followUpStartDate.toISOString(),
        follow_up_end: followUpEndDate.toISOString(),
        admin_notes: adminNotes,
        payment_link: paymentLink,
        created_at: new Date().toISOString()
      };

      // Mettre à jour l'application avec le planning et le statut
      const { error } = await supabase
        .from('political_launch_applications')
        .update({
          status: 'payment_pending',
          proposed_schedule: scheduleData,
          admin_response: adminNotes,
          payment_link: paymentLink,
          schedule_validated: true
        })
        .eq('id', id);

      if (error) throw error;

      // Envoyer l'email avec le planning et le lien de paiement
      const emailData = {
        to: application.email,
        subject: "Votre planning personnalisé - Programme Je me lance en politique",
        content: `
          <h2>Bonjour ${application.full_name},</h2>
          
          <p>Nous avons le plaisir de vous proposer le planning suivant pour votre programme "Je me lance en politique" :</p>
          
          <h3>📅 Planning de votre programme</h3>
          <p><strong>Date de début :</strong> ${startDate.toLocaleDateString('fr-FR')}</p>
          
          <h4>🎯 Séances intensives de coaching (8 séances) :</h4>
          <ul>
            ${sessionDates.map((date, index) => 
              `<li>Séance ${index + 1} : ${date.toLocaleDateString('fr-FR')}</li>`
            ).join('')}
          </ul>
          
          <h4>📈 Période de suivi post-coaching :</h4>
          <p>Du ${followUpStartDate.toLocaleDateString('fr-FR')} au ${followUpEndDate.toLocaleDateString('fr-FR')}</p>
          
          ${adminNotes ? `<h4>💬 Message personnel :</h4><p>${adminNotes}</p>` : ''}
          
          <h3>💳 Finaliser votre inscription</h3>
          <p>Pour confirmer votre place et commencer cette aventure transformatrice, cliquez sur le lien ci-dessous :</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}" style="background-color: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              💰 Procéder au paiement (${getPrice(application.payment_option)}$ USD)
            </a>
          </p>
          
          <p><em>Nous avons hâte de vous accompagner dans cette aventure politique !</em></p>
          
          <p>Cordialement,<br>
          <strong>DOMANI DORÉ</strong><br>
          Coach en leadership politique</p>
        `
      };

      await supabase.functions.invoke('send-email', { body: emailData });

      toast({
        title: "Succès",
        description: "Planning validé et lien de paiement envoyé au client par email",
      });

      navigate('/admin/political-launch');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le planning",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPrice = (paymentOption: string) => {
    return paymentOption.includes('entièrement') ? 1500 : 1800;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-center text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500">Candidature non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/admin/political-launch')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Proposition de Planning</h1>
              <p className="text-gray-600">Programme "Je me lance en politique"</p>
            </div>
          </div>
        </div>

        {/* Informations du candidat */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations du candidat</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{application.full_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{application.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{application.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{application.city_country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Format:</span>
                <Badge variant="outline">{application.format_preference}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Montant:</span>
                <Badge className="bg-green-100 text-green-800">
                  {getPrice(application.payment_option)}$ USD
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planning */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Planification du Programme (8 séances)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date de début */}
            <div>
              <Label htmlFor="start-date">Date de début du programme *</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                className="mt-1"
              />
            </div>

            {/* 8 séances intensives */}
            <div>
              <Label>8 Séances intensives de coaching *</Label>
              <div className="space-y-3 mt-2">
                {sessionDates.map((date, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm font-medium min-w-[80px]">
                      Séance {index + 1}:
                    </span>
                    <DatePicker
                      date={date}
                      setDate={(newDate) => updateSessionDate(index, newDate)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSessionDate(index)}
                      className="text-red-600"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                {sessionDates.length < 8 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSessionDate}
                    className="w-full"
                  >
                    Ajouter une séance ({sessionDates.length}/8)
                  </Button>
                )}
              </div>
            </div>

            {/* Période de suivi post-coaching */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Début du suivi post-coaching (2 semaines) *</Label>
                <DatePicker
                  date={followUpStartDate}
                  setDate={setFollowUpStartDate}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fin du suivi post-coaching *</Label>
                <DatePicker
                  date={followUpEndDate}
                  setDate={setFollowUpEndDate}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Notes administrateur */}
            <div>
              <Label htmlFor="admin-notes">Message personnalisé pour le client</Label>
              <Textarea
                id="admin-notes"
                placeholder="Message d'accompagnement, instructions spéciales, etc..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/political-launch')}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSaveSchedule}
            disabled={isSaving || !startDate || sessionDates.length !== 8 || !followUpStartDate || !followUpEndDate}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Valider & Envoyer le Lien de Paiement
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPoliticalLaunchSchedule;
