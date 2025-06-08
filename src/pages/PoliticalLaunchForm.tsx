
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Crown, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@/components/ui/date-picker';

const PoliticalLaunchForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    professional_profile: '',
    other_profile: '',
    city_country: '',
    gender: '',
    age_group: '',
    social_media: '',
    discovery_channel: '',
    other_discovery_channel: '',
    political_situation: [] as string[],
    other_political_situation: '',
    obstacles: [] as string[],
    other_obstacles: '',
    leadership_qualities: '',
    desired_transformation: '',
    coaching_experience: '',
    personal_situation: [] as string[],
    other_personal_situation: '',
    preferred_topic: '',
    why_collaboration: '',
    format_preference: '',
    contact_preference: '',
    start_period: '',
    preferred_start_date: undefined as Date | undefined,
    comfort_options: [] as string[],
    payment_option: '',
    payment_method: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('political_launch_applications')
        .insert({
          ...formData,
          preferred_start_date: formData.preferred_start_date?.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Candidature envoyée avec succès !",
        description: "Nous examinerons votre candidature et vous contacterons rapidement.",
      });

      navigate('/');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-12 w-12 text-amber-500 mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Programme "Je me lance en politique"
            </h1>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">ET SI NOUS FAISIONS CONNAISSANCE ?</h2>
            <div className="text-left space-y-3 text-gray-700">
              <p>Bonjour, je suis si fière de vous retrouver ici et félicitation pour votre engagement.</p>
              <p>En effet, ce formulaire s'adresse exclusivement à celles et ceux qui souhaitent réussir leurs premiers pas en politique, bâtir sereinement une carrière politique hors du commun et qui reflète leurs valeurs.</p>
              <p>Mon objectif à moi, est donc de comprendre votre situation actuelle pour déterminer en priorité, si je suis la bonne personne pour vous accompagner et ainsi préparer efficacement cette aventure ensemble.</p>
              <p className="font-semibold">Il faut que je vous le dise : je n'accepte de travailler qu'avec des femmes, des hommes et donc avec des personnalités, prêtes à s'investir à 100% pour provoquer leur ascension politique par une méthode audacieuse.</p>
              <p>Merci de remplir le formulaire à présent et à nos succès mérités !</p>
              <div className="mt-4 text-right">
                <p className="font-bold text-amber-700">DOMANI DORÉ</p>
                <p className="text-sm">Coach en leadership politique et développement professionnel</p>
                <p className="text-sm">Ancienne Ministre et parlementaire</p>
                <p className="text-sm">Fondatrice associée du cabinet Dom Consulting</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Prénom et nom *</Label>
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Adresse e-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Numéro de téléphone et WhatsApp *</Label>
                  <Input
                    id="phone"
                    placeholder="+225 ............ (Merci de préciser l'indicatif pays)"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city_country">Ville et pays de résidence *</Label>
                  <Input
                    id="city_country"
                    required
                    value={formData.city_country}
                    onChange={(e) => handleInputChange('city_country', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Sexe *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Femme">Femme</SelectItem>
                      <SelectItem value="Homme">Homme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tranche d'âge *</Label>
                  <Select value={formData.age_group} onValueChange={(value) => handleInputChange('age_group', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Moins de 35 ans">Moins de 35 ans</SelectItem>
                      <SelectItem value="Entre 35 ans et 45 ans">Entre 35 ans et 45 ans</SelectItem>
                      <SelectItem value="Entre 45 ans et 55 ans">Entre 45 ans et 55 ans</SelectItem>
                      <SelectItem value="Plus de 55 ans">Plus de 55 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profil professionnel *</Label>
                  <Select value={formData.professional_profile} onValueChange={(value) => handleInputChange('professional_profile', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entrepreneur(e)">Entrepreneur(e)</SelectItem>
                      <SelectItem value="Haut cadre">Haut cadre</SelectItem>
                      <SelectItem value="Fonctionnaire">Fonctionnaire</SelectItem>
                      <SelectItem value="Parlementaire (Député)">Parlementaire (Député)</SelectItem>
                      <SelectItem value="élu(e) local(e)">élu(e) local(e)</SelectItem>
                      <SelectItem value="Retraité(e)">Retraité(e)</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.professional_profile === 'Autre' && (
                <div>
                  <Label htmlFor="other_profile">Autre profil</Label>
                  <Input
                    id="other_profile"
                    value={formData.other_profile}
                    onChange={(e) => handleInputChange('other_profile', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Découverte et réseaux sociaux */}
          <Card>
            <CardHeader>
              <CardTitle>Présence digitale et découverte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="social_media">Lien de votre site ou nom sur les réseaux sociaux *</Label>
                <Input
                  id="social_media"
                  placeholder="Facebook / TikTok / Instagram / Site web"
                  required
                  value={formData.social_media}
                  onChange={(e) => handleInputChange('social_media', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Comment avez-vous entendu parler de mes accompagnements ? *</Label>
                <Select value={formData.discovery_channel} onValueChange={(value) => handleInputChange('discovery_channel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Par une connaissance">Par une connaissance</SelectItem>
                    <SelectItem value="Sur recommandation client(e)s">Sur recommandation client(e)s</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Twitter ou X">Twitter ou X</SelectItem>
                    <SelectItem value="Linkedin">Linkedin</SelectItem>
                    <SelectItem value="Treads">Treads</SelectItem>
                    <SelectItem value="Sur votre site via une recherche google">Google</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.discovery_channel === 'Autre' && (
                <div>
                  <Label htmlFor="other_discovery_channel">Autre canal de découverte</Label>
                  <Input
                    id="other_discovery_channel"
                    value={formData.other_discovery_channel}
                    onChange={(e) => handleInputChange('other_discovery_channel', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Situation politique */}
          <Card>
            <CardHeader>
              <CardTitle>Situation politique actuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quelle est votre situation actuelle ? (choix multiples) *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    "Activiste social, je prépare ma future candidature",
                    "Futur(e) candidat(e) non déclaré encore",
                    "Je préside un Parti politique ou une dynamique politique",
                    "Ex Candidat(e) à une élection",
                    "Membre du Bureau d'un parti ou d'une dynamique politique",
                    "Élu(e) en exercice pour la 1ère fois",
                    "Haut cadre en poste ou reconversion vers l'administration publique en cours",
                    "Militant(e) d'un Parti Politique",
                    "Autre"
                  ].map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`political_${option}`}
                        checked={formData.political_situation.includes(option)}
                        onCheckedChange={(checked) => handleArrayChange('political_situation', option, !!checked)}
                      />
                      <Label htmlFor={`political_${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.political_situation.includes('Autre') && (
                <div>
                  <Label htmlFor="other_political_situation">Autre situation politique</Label>
                  <Input
                    id="other_political_situation"
                    value={formData.other_political_situation}
                    onChange={(e) => handleInputChange('other_political_situation', e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label>Quels sont vos plus grands obstacles ? (choix multiples)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    "Manque de confiance en soi",
                    "Manque de visibilité",
                    "Manque de discipline et de plan stratégique",
                    "Manque de réseau et de soutien",
                    "Autre"
                  ].map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`obstacle_${option}`}
                        checked={formData.obstacles.includes(option)}
                        onCheckedChange={(checked) => handleArrayChange('obstacles', option, !!checked)}
                      />
                      <Label htmlFor={`obstacle_${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.obstacles.includes('Autre') && (
                <div>
                  <Label htmlFor="other_obstacles">Autres obstacles</Label>
                  <Input
                    id="other_obstacles"
                    value={formData.other_obstacles}
                    onChange={(e) => handleInputChange('other_obstacles', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leadership et objectifs */}
          <Card>
            <CardHeader>
              <CardTitle>Leadership et objectifs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="leadership_qualities">3 qualificatifs qui vous décrivent comme leader *</Label>
                <Textarea
                  id="leadership_qualities"
                  required
                  rows={2}
                  value={formData.leadership_qualities}
                  onChange={(e) => handleInputChange('leadership_qualities', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="desired_transformation">Unique transformation souhaitée au sortir de ce programme *</Label>
                <Textarea
                  id="desired_transformation"
                  required
                  rows={3}
                  value={formData.desired_transformation}
                  onChange={(e) => handleInputChange('desired_transformation', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="coaching_experience">Expérience de coaching antérieure *</Label>
                <Textarea
                  id="coaching_experience"
                  required
                  rows={3}
                  placeholder="Avez-vous déjà fait recours à un coach politique ou autre? Si oui, qu'est-ce que vous n'avez pas aimé? Si non, merci de le préciser."
                  value={formData.coaching_experience}
                  onChange={(e) => handleInputChange('coaching_experience', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="preferred_topic">Thématique à aborder amplement *</Label>
                <Textarea
                  id="preferred_topic"
                  required
                  rows={2}
                  value={formData.preferred_topic}
                  onChange={(e) => handleInputChange('preferred_topic', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="why_collaboration">Pourquoi souhaitez-vous franchir ce pas avec moi ? *</Label>
                <Textarea
                  id="why_collaboration"
                  required
                  rows={3}
                  value={formData.why_collaboration}
                  onChange={(e) => handleInputChange('why_collaboration', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Situation personnelle */}
          <Card>
            <CardHeader>
              <CardTitle>Situation personnelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Situation dans votre vie privée *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["Marié(e)", "Maman ou papa solo", "En couple", "Célibataire", "Autre"].map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`personal_${option}`}
                        checked={formData.personal_situation.includes(option)}
                        onCheckedChange={(checked) => handleArrayChange('personal_situation', option, !!checked)}
                      />
                      <Label htmlFor={`personal_${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.personal_situation.includes('Autre') && (
                <div>
                  <Label htmlFor="other_personal_situation">Autre situation personnelle</Label>
                  <Input
                    id="other_personal_situation"
                    value={formData.other_personal_situation}
                    onChange={(e) => handleInputChange('other_personal_situation', e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modalités d'accompagnement */}
          <Card>
            <CardHeader>
              <CardTitle>Modalités d'accompagnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Format souhaité *</Label>
                  <Select value={formData.format_preference} onValueChange={(value) => handleInputChange('format_preference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En Ligne via Zoom">En Ligne via Zoom</SelectItem>
                      <SelectItem value="En Présentiel dans nos bureaux">En Présentiel dans nos bureaux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Canal de contact privilégié *</Label>
                  <Select value={formData.contact_preference} onValueChange={(value) => handleInputChange('contact_preference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Par email">Par email</SelectItem>
                      <SelectItem value="Via WhatsApp">Via WhatsApp</SelectItem>
                      <SelectItem value="Via les deux">Via les deux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Période de début souhaitée *</Label>
                <Select value={formData.start_period} onValueChange={(value) => handleInputChange('start_period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Au courant de la semaine (minimum 48h)">Au courant de la semaine (minimum 48h)</SelectItem>
                    <SelectItem value="Le mois prochain">Le mois prochain</SelectItem>
                    <SelectItem value="Date de mon choix">Date de mon choix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.start_period === 'Date de mon choix' && (
                <div>
                  <Label>Date de début préférée</Label>
                  <DatePicker
                    date={formData.preferred_start_date}
                    setDate={(date) => setFormData(prev => ({ ...prev, preferred_start_date: date }))}
                    className="mt-1"
                  />
                </div>
              )}

              {formData.format_preference === 'En Présentiel dans nos bureaux' && (
                <div>
                  <Label>Options de commodité (présentiel)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "De L'eau",
                      "Boisson chaude (Thé ou Café)",
                      "Boisson fraîche (jus de fruit)",
                      "Amuse bouche sec (Amandes, arachides, ....)",
                      "Des fruits"
                    ].map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`comfort_${option}`}
                          checked={formData.comfort_options.includes(option)}
                          onCheckedChange={(checked) => handleArrayChange('comfort_options', option, !!checked)}
                        />
                        <Label htmlFor={`comfort_${option}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investissement */}
          <Card>
            <CardHeader>
              <CardTitle>Modalités de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Valeur de votre investissement :</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1500$ USD</strong> - Paiement en entier</p>
                  <p><strong>1800$ USD</strong> - Payable en 2 tranches (1000$ à l'inscription)</p>
                </div>
                <p className="text-xs text-amber-700 mt-2">
                  <strong>Important :</strong> Nous ne prenons que 3 personnes par mois par souci d'efficacité
                </p>
              </div>

              <div>
                <Label>Option de paiement *</Label>
                <RadioGroup 
                  value={formData.payment_option} 
                  onValueChange={(value) => handleInputChange('payment_option', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Je souhaite payer entièrement pour mon accompagnement" id="pay_full" />
                    <Label htmlFor="pay_full">Je souhaite payer entièrement (1500$ USD)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Je souhaite payer en 2 tranches" id="pay_installments" />
                    <Label htmlFor="pay_installments">Je souhaite payer en 2 tranches (1800$ USD)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Méthode de paiement préférée *</Label>
                <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carte bancaire">Carte bancaire</SelectItem>
                    <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                    <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Envoyer ma candidature
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoliticalLaunchForm;
