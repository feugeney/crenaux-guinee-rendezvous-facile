
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Crown, Heart, Star } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(1, 'Le prénom et nom sont requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le numéro de téléphone est requis'),
  professionalProfile: z.string().min(1, 'Le profil professionnel est requis'),
  otherProfile: z.string().optional(),
  cityCountry: z.string().min(1, 'La ville et pays sont requis'),
  gender: z.string().min(1, 'Le sexe est requis'),
  ageGroup: z.string().min(1, 'La tranche d\'âge est requise'),
  socialMedia: z.string().min(1, 'Le lien des réseaux sociaux est requis'),
  discoveryChannel: z.string().min(1, 'Comment avez-vous entendu parler de nous est requis'),
  otherDiscoveryChannel: z.string().optional(),
  politicalSituation: z.array(z.string()).min(1, 'Au moins une situation politique doit être sélectionnée'),
  otherPoliticalSituation: z.string().optional(),
  obstacles: z.array(z.string()).optional(),
  otherObstacles: z.string().optional(),
  leadershipQualities: z.string().min(1, 'Les qualités de leadership sont requises'),
  desiredTransformation: z.string().min(1, 'La transformation souhaitée est requise'),
  coachingExperience: z.string().min(1, 'L\'expérience de coaching est requise'),
  personalSituation: z.array(z.string()).min(1, 'Au moins une situation personnelle doit être sélectionnée'),
  otherPersonalSituation: z.string().optional(),
  preferredTopic: z.string().min(1, 'La thématique préférée est requise'),
  whyCollaboration: z.string().min(1, 'Pourquoi collaborer avec nous est requis'),
  formatPreference: z.string().min(1, 'Le format de préférence est requis'),
  contactPreference: z.string().min(1, 'La préférence de contact est requise'),
  startPeriod: z.string().min(1, 'La période de début est requise'),
  preferredStartDate: z.string().optional(),
  comfortOptions: z.array(z.string()).optional(),
  paymentOption: z.string().min(1, 'L\'option de paiement est requise'),
  paymentMethod: z.string().min(1, 'La méthode de paiement est requise')
});

type FormData = z.infer<typeof formSchema>;

const PoliticalLaunchForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      politicalSituation: [],
      obstacles: [],
      personalSituation: [],
      comfortOptions: []
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('political_launch_applications')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          professional_profile: data.professionalProfile,
          other_profile: data.otherProfile,
          city_country: data.cityCountry,
          gender: data.gender,
          age_group: data.ageGroup,
          social_media: data.socialMedia,
          discovery_channel: data.discoveryChannel,
          other_discovery_channel: data.otherDiscoveryChannel,
          political_situation: data.politicalSituation,
          other_political_situation: data.otherPoliticalSituation,
          obstacles: data.obstacles,
          other_obstacles: data.otherObstacles,
          leadership_qualities: data.leadershipQualities,
          desired_transformation: data.desiredTransformation,
          coaching_experience: data.coachingExperience,
          personal_situation: data.personalSituation,
          other_personal_situation: data.otherPersonalSituation,
          preferred_topic: data.preferredTopic,
          why_collaboration: data.whyCollaboration,
          format_preference: data.formatPreference,
          contact_preference: data.contactPreference,
          start_period: data.startPeriod,
          preferred_start_date: data.preferredStartDate ? new Date(data.preferredStartDate).toISOString().split('T')[0] : null,
          comfort_options: data.comfortOptions,
          payment_option: data.paymentOption,
          payment_method: data.paymentMethod
        });

      if (error) throw error;

      toast({
        title: "Candidature soumise avec succès !",
        description: "Nous examinerons votre candidature et vous contacterons bientôt.",
      });

      form.reset();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const professionalProfiles = [
    'Entrepreneur(e)',
    'Haut cadre',
    'Fonctionnaire',
    'Parlementaire (Député)',
    'élu(e) local(e)',
    'Retraité(e)',
    'Autre'
  ];

  const ageGroups = [
    'Moins de 35 ans',
    'Entre 35 ans et 45 ans',
    'Entre 45 ans et 55 ans',
    'Plus de 55 ans'
  ];

  const discoveryChannels = [
    'Par une connaissance',
    'Sur recommandation client(e)s',
    'Facebook',
    'Instagram',
    'TikTok',
    'Twitter ou X',
    'Linkedin',
    'Treads',
    'Sur votre site via une recherche google'
  ];

  const politicalSituations = [
    'Activiste social, je prépare ma future candidature',
    'Futur(e) candidat(e) non déclaré encore',
    'Je préside un Parti politique ou une dynamique politique',
    'Ex Candidat(e) à une élection',
    'Membre du Bureau d\'un parti ou d\'une dynamique politique',
    'Élu(e) en exercice pour la 1ère fois',
    'Haut cadre en poste ou reconversion vers l\'administration publique en cours',
    'Militant(e) d\'un Parti Politique',
    'Autre'
  ];

  const obstaclesOptions = [
    'Manque de confiance en soi',
    'Manque de visibilité',
    'Manque de discipline et de plan stratégique',
    'Manque de réseau et de soutien',
    'Autre…'
  ];

  const personalSituations = [
    'Marié (e)',
    'Maman ou papa solo',
    'En couple',
    'Célibataire',
    'Autre'
  ];

  const comfortOptions = [
    'De L\'eau',
    'Boisson chaude (Thé ou Café)',
    'Boisson fraîche (jus de fruit)',
    'Amuse bouche sec (Amandes, arachides, ....)',
    'Des fruits'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-amber-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Crown className="h-8 w-8" />
              <CardTitle className="text-2xl font-bold">ET SI NOUS FAISIONS CONNAISSANCE ?</CardTitle>
              <Crown className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong>Bonjour, je suis si fière de vous retrouver ici et félicitation pour votre engagement.</strong>
              </p>
              
              <p>
                En effet, ce formulaire s'adresse exclusivement à celles et ceux qui souhaitent réussir leurs premiers pas en politique, 
                bâtir sereinement une carrière politique hors du commun et qui reflète leurs valeurs.
              </p>
              
              <p>
                Mon objectif à moi, est donc de comprendre votre situation actuelle pour déterminer en priorité, si je suis la bonne 
                personne pour vous accompagner et ainsi préparer efficacement cette aventure ensemble.
              </p>
              
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <p className="font-semibold text-amber-800">
                  Il faut que je vous le dise : je n'accepte de travailler qu'avec des femmes, des hommes et donc avec des personnalités, 
                  prêtes à s'investir à 100 % pour provoquer leur ascension politique par une méthode audacieuse.
                </p>
              </div>
              
              <p>
                Si vous vous engagez avec notre équipe à travers le cabinet Dom Consulting, j'investis tout mon cœur, mon temps, 
                et mon énergie à vos côtés, car nous travaillons à maintenir notre position de leader du coaching politique sur le continent africain.
              </p>
              
              <p>
                C'est pourquoi je sélectionne des personnes engagées, respectueuses des efforts et suffisamment ambitieuses, 
                pour investir sur elles-mêmes afin de prétendre à plus de responsabilités, au service du bien commun.
              </p>
              
              <div className="text-center bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg">
                <p className="font-bold text-lg text-amber-800 mb-2">
                  Merci de remplir le formulaire à présent et à nos succès mérités !
                </p>
                <div className="space-y-1 text-amber-700">
                  <p className="font-semibold">DOMANI DORÉ</p>
                  <p className="text-sm">Coach en leadership politique et développement professionnel</p>
                  <p className="text-sm">Ancienne Ministre et parlementaire</p>
                  <p className="text-sm">Fondatrice associée du cabinet Dom Consulting</p>
                  <p className="text-sm font-semibold">Leader du coaching politique en Afrique francophone</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-lg border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
            <CardTitle className="text-xl text-center">Programme "Je me lance en politique"</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Informations personnelles */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-200 pb-2">
                    Informations personnelles
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom et nom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre prénom et nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse e-mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone et WhatsApp (Merci de préciser l'indicatif pays SVP) *</FormLabel>
                        <FormControl>
                          <Input placeholder="Exemple: +225 ............" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professionalProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profil professionnel *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {professionalProfiles.map((profile) => (
                                <div key={profile} className="flex items-center space-x-2">
                                  <RadioGroupItem value={profile} id={profile} />
                                  <Label htmlFor={profile} className="text-sm">{profile}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('professionalProfile') === 'Autre' && (
                    <FormField
                      control={form.control}
                      name="otherProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autre : (Merci de saisir ici)</FormLabel>
                          <FormControl>
                            <Input placeholder="Précisez votre profil" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="cityCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville et pays de résidence *</FormLabel>
                        <FormControl>
                          <Input placeholder="Abidjan, Côte d'Ivoire" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexe *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="flex space-x-6">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Femme" id="femme" />
                                <Label htmlFor="femme">Femme</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Homme" id="homme" />
                                <Label htmlFor="homme">Homme</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre tranche d'âge SVP *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {ageGroups.map((age) => (
                                <div key={age} className="flex items-center space-x-2">
                                  <RadioGroupItem value={age} id={age} />
                                  <Label htmlFor={age} className="text-sm">{age}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Le lien de votre site ou votre nom sur les plateformes de réseaux sociaux *</FormLabel>
                        <FormControl>
                          <Input placeholder="Exemples: Facebook / TikTok" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discoveryChannel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment avez-vous entendu parler de mes accompagnements SVP ? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {discoveryChannels.map((channel) => (
                                <div key={channel} className="flex items-center space-x-2">
                                  <RadioGroupItem value={channel} id={channel} />
                                  <Label htmlFor={channel} className="text-sm">{channel}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 2: Situation politique */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-200 pb-2">
                    Situation politique et objectifs
                  </h3>

                  <FormField
                    control={form.control}
                    name="politicalSituation"
                    render={() => (
                      <FormItem>
                        <FormLabel>Quelle est votre situation actuelle sur le plan politique ou citoyen? (choix multiple) *</FormLabel>
                        <div className="grid grid-cols-1 gap-3">
                          {politicalSituations.map((situation) => (
                            <FormField
                              key={situation}
                              control={form.control}
                              name="politicalSituation"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(situation)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, situation])
                                            : field.onChange(field.value?.filter((value) => value !== situation))
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <Label className="text-sm font-normal">{situation}</Label>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('politicalSituation')?.includes('Autre') && (
                    <FormField
                      control={form.control}
                      name="otherPoliticalSituation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autre : (Merci de saisir votre réponse ici)</FormLabel>
                          <FormControl>
                            <Input placeholder="Précisez votre situation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="obstacles"
                    render={() => (
                      <FormItem>
                        <FormLabel>Quels sont les plus grands obstacles ou difficultés que vous rencontrez en ce moment ? (choix multiples)</FormLabel>
                        <div className="grid grid-cols-1 gap-3">
                          {obstaclesOptions.map((obstacle) => (
                            <FormField
                              key={obstacle}
                              control={form.control}
                              name="obstacles"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(obstacle)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), obstacle])
                                            : field.onChange(field.value?.filter((value) => value !== obstacle))
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <Label className="text-sm font-normal">{obstacle}</Label>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('obstacles')?.includes('Autre…') && (
                    <FormField
                      control={form.control}
                      name="otherObstacles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autre : (Merci de saisir votre réponse ici)</FormLabel>
                          <FormControl>
                            <Input placeholder="Précisez vos obstacles" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="leadershipQualities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Si vous deviez décrire le leader que vous êtes en 3 qualificatifs, que diriez-vous ? *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Déterminé, Visionnaire, Empathique" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desiredTransformation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quelle serait l'unique transformation que vous souhaitez au sortir de ce programme de coaching ? *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Décrivez la transformation souhaitée..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coachingExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avez-vous déjà fait recours à un coach politique ou autre? si oui, qu'est ce que vous n'avez pas aimé dans cette expérience passée? si non, merci de le préciser SVP *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Décrivez votre expérience..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 3: Situation personnelle */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-200 pb-2">
                    Situation personnelle et préférences
                  </h3>

                  <FormField
                    control={form.control}
                    name="personalSituation"
                    render={() => (
                      <FormItem>
                        <FormLabel>Quelle est votre situation dans votre vie privée actuelle (cocher plusieurs) *</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {personalSituations.map((situation) => (
                            <FormField
                              key={situation}
                              control={form.control}
                              name="personalSituation"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(situation)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, situation])
                                            : field.onChange(field.value?.filter((value) => value !== situation))
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <Label className="text-sm font-normal">{situation}</Label>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('personalSituation')?.includes('Autre') && (
                    <FormField
                      control={form.control}
                      name="otherPersonalSituation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autre : (Merci de saisir votre réponse ici SVP)</FormLabel>
                          <FormControl>
                            <Input placeholder="Précisez votre situation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="preferredTopic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quelle est la thématique ou la problématique que vous aimeriez qu'on aborde amplement durant cette aventure ensemble ? *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Décrivez la thématique souhaitée..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyCollaboration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pourquoi pensez-vous que nous sommes un bon duo pour travailler ensemble? Pourquoi souhaitez-vous franchir ce pas important de votre vie avec moi ? *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Expliquez pourquoi vous souhaitez collaborer avec nous..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formatPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quel format souhaitez-vous pour notre programme d'accompagnement ? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="En Ligne via Zoom" id="zoom" />
                                <Label htmlFor="zoom">En Ligne via Zoom</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="En Présentiel dans nos bureaux" id="presentiel" />
                                <Label htmlFor="presentiel">En Présentiel dans nos bureaux</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Par quel canal êtes-vous plus réactif pour vous recontacter rapidement en raison des créneaux de réservation à l'avance SVP? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Par email" id="email" />
                                <Label htmlFor="email">Par email</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Via WhatsApp" id="whatsapp" />
                                <Label htmlFor="whatsapp">Via WhatsApp</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Via les deux" id="both" />
                                <Label htmlFor="both">Via les deux</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quand souhaitez-vous commencer le programme ? *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Au courant de la semaine (minimum 48h)" id="thisweek" />
                                <Label htmlFor="thisweek">Au courant de la semaine (minimum 48h)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Le mois prochain" id="nextmonth" />
                                <Label htmlFor="nextmonth">Le mois prochain</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Date de mon choix" id="customdate" />
                                <Label htmlFor="customdate">Date de mon choix</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('startPeriod') === 'Date de mon choix' && (
                    <FormField
                      control={form.control}
                      name="preferredStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de début souhaitée</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch('formatPreference') === 'En Présentiel dans nos bureaux' && (
                    <FormField
                      control={form.control}
                      name="comfortOptions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Si vous avez souscrit à l'option en Présentiel, choisissez votre option de commodité (choix multiple)</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {comfortOptions.map((option) => (
                              <FormField
                                key={option}
                                control={form.control}
                                name="comfortOptions"
                                render={({ field }) => {
                                  return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), option])
                                              : field.onChange(field.value?.filter((value) => value !== option))
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none">
                                        <Label className="text-sm font-normal">{option}</Label>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Section 4: Paiement */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-200 pb-2">
                    Options de paiement
                  </h3>

                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Star className="h-5 w-5 text-amber-500" />
                      <h4 className="font-semibold text-amber-800">Valeur de votre investissement</h4>
                    </div>
                    <div className="space-y-2 text-amber-700">
                      <p><strong>Programme "LANCEMENT POLITIQUE" :</strong></p>
                      <p>• <span className="line-through">1800 $</span> <strong className="text-green-600">1500 $ USD</strong> paiement en entier</p>
                      <p>• <strong>1800 $ USD</strong> payable en 2 tranches soit 1000 $ USD à l'inscription</p>
                    </div>
                    <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-300">
                      <p className="text-orange-800 font-medium">
                        <Heart className="h-4 w-4 inline mr-1" />
                        À rappeler que nous ne prenons que 3 personnes par mois par souci d'efficacité
                      </p>
                    </div>
                    <div className="mt-4 text-sm text-amber-600">
                      <p><strong>Précision importante :</strong></p>
                      <p>Après la confirmation de votre inscription, nous échangerons afin de convenir du planning d'accompagnement, de la date de notre première séance et du rythme qui vous convient.</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="paymentOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option de paiement *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Je souhaite payer entièrement pour mon accompagnement" id="full" />
                                <Label htmlFor="full">Je souhaite payer entièrement pour mon accompagnement (1500 $ USD)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Je souhaite payer en 2 tranches" id="split" />
                                <Label htmlFor="split">Je souhaite payer en 2 tranches (1800 $ USD total)</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Méthode de paiement préférée *</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} value={field.value}>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Carte bancaire (Stripe)" id="stripe" />
                                <Label htmlFor="stripe">Carte bancaire (Stripe)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Orange Money (exclusivement si vous êtes en Guinée)" id="orange" />
                                <Label htmlFor="orange">Orange Money (exclusivement si vous êtes en Guinée)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Virement bancaire" id="wire" />
                                <Label htmlFor="wire">Virement bancaire</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-12 py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliticalLaunchForm;
