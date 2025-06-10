
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

const countries: Country[] = [
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "33" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "1" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", phoneCode: "32" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", phoneCode: "41" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", phoneCode: "352" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", phoneCode: "377" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", phoneCode: "1" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", phoneCode: "44" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", phoneCode: "49" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", phoneCode: "34" },
  { code: "IT", name: "Italie", flag: "🇮🇹", phoneCode: "39" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "351" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿", phoneCode: "213" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", phoneCode: "212" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", phoneCode: "216" },
  { code: "other", name: "Autre", flag: "🌐", phoneCode: "" }
];

interface PoliticalLaunchFormValues {
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  other_profile?: string;
  city_country: string;
  gender: string;
  age_group: string;
  social_media: string;
  discovery_channel: string;
  other_discovery_channel?: string;
  political_situation: string[];
  other_political_situation?: string;
  obstacles?: string[];
  other_obstacles?: string;
  leadership_qualities: string;
  desired_transformation: string;
  coaching_experience: string;
  personal_situation: string[];
  other_personal_situation?: string;
  preferred_topic: string;
  why_collaboration: string;
  format_preference: string;
  contact_preference: string;
  start_period: string;
  comfort_options?: string[];
  payment_option: string;
  payment_method: string;
  preferred_start_date?: string;
}

const PoliticalLaunchForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedObstacles, setSelectedObstacles] = useState<string[]>([]);
  const [selectedPersonalSituation, setSelectedPersonalSituation] = useState<string[]>([]);
  const [selectedPoliticalSituation, setSelectedPoliticalSituation] = useState<string[]>([]);
  const [selectedComfortOptions, setSelectedComfortOptions] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PoliticalLaunchFormValues>();

  const handleCheckboxChange = (value: string, checked: boolean, field: string) => {
    let updatedValues: string[] = [];
    
    switch (field) {
      case 'obstacles':
        updatedValues = checked 
          ? [...selectedObstacles, value]
          : selectedObstacles.filter(item => item !== value);
        setSelectedObstacles(updatedValues);
        setValue('obstacles', updatedValues);
        break;
      case 'personal_situation':
        updatedValues = checked 
          ? [...selectedPersonalSituation, value]
          : selectedPersonalSituation.filter(item => item !== value);
        setSelectedPersonalSituation(updatedValues);
        setValue('personal_situation', updatedValues);
        break;
      case 'political_situation':
        updatedValues = checked 
          ? [...selectedPoliticalSituation, value]
          : selectedPoliticalSituation.filter(item => item !== value);
        setSelectedPoliticalSituation(updatedValues);
        setValue('political_situation', updatedValues);
        break;
      case 'comfort_options':
        updatedValues = checked 
          ? [...selectedComfortOptions, value]
          : selectedComfortOptions.filter(item => item !== value);
        setSelectedComfortOptions(updatedValues);
        setValue('comfort_options', updatedValues);
        break;
    }
  };

  const onSubmit = async (data: PoliticalLaunchFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Données du formulaire:', data);

      // Préparer les données selon la structure de la base de données
      const formData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        professional_profile: data.professional_profile,
        other_profile: data.other_profile || null,
        city_country: data.city_country,
        gender: data.gender,
        age_group: data.age_group,
        social_media: data.social_media,
        discovery_channel: data.discovery_channel,
        other_discovery_channel: data.other_discovery_channel || null,
        political_situation: selectedPoliticalSituation,
        other_political_situation: data.other_political_situation || null,
        obstacles: selectedObstacles,
        other_obstacles: data.other_obstacles || null,
        leadership_qualities: data.leadership_qualities,
        desired_transformation: data.desired_transformation,
        coaching_experience: data.coaching_experience,
        personal_situation: selectedPersonalSituation,
        other_personal_situation: data.other_personal_situation || null,
        preferred_topic: data.preferred_topic,
        why_collaboration: data.why_collaboration,
        format_preference: data.format_preference,
        contact_preference: data.contact_preference,
        start_period: data.start_period,
        comfort_options: selectedComfortOptions,
        payment_option: data.payment_option,
        payment_method: data.payment_method,
        preferred_start_date: data.preferred_start_date ? new Date(data.preferred_start_date).toISOString().split('T')[0] : null,
        status: 'pending'
      };

      console.log('Données formatées:', formData);

      const { data: result, error } = await supabase
        .from('political_launch_applications')
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Candidature créée:', result);

      toast({
        title: "Candidature envoyée avec succès",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      });

      // Rediriger vers la page de succès
      navigate('/political-launch-success');
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de l'envoi: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coaching-50 to-coaching-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-coaching-800">
              Programme "Je me lance en politique"
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Formulaire de candidature pour rejoindre notre programme d'accompagnement politique personnalisé
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      {...register("full_name", { required: "Le nom complet est requis" })}
                      placeholder="Votre nom complet"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Email invalide"
                        }
                      })}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <Input
                      id="phone"
                      {...register("phone", { required: "Le numéro de téléphone est requis" })}
                      placeholder="+33 1 23 45 67 89"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city_country">Ville/Pays *</Label>
                    <Input
                      id="city_country"
                      {...register("city_country", { required: "La ville/pays est requise" })}
                      placeholder="Paris, France"
                    />
                    {errors.city_country && (
                      <p className="text-red-500 text-sm mt-1">{errors.city_country.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Genre *</Label>
                    <Select onValueChange={(value) => setValue("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                        <SelectItem value="non_specifie">Non spécifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="age_group">Tranche d'âge *</Label>
                    <Select onValueChange={(value) => setValue("age_group", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25 ans</SelectItem>
                        <SelectItem value="26-35">26-35 ans</SelectItem>
                        <SelectItem value="36-45">36-45 ans</SelectItem>
                        <SelectItem value="46-55">46-55 ans</SelectItem>
                        <SelectItem value="56-65">56-65 ans</SelectItem>
                        <SelectItem value="65+">65+ ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="social_media">Réseaux sociaux *</Label>
                    <Select onValueChange={(value) => setValue("social_media", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Principal réseau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="aucun">Aucun</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="professional_profile">Profil professionnel *</Label>
                  <Select onValueChange={(value) => setValue("professional_profile", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etudiant">Étudiant(e)</SelectItem>
                      <SelectItem value="salarie">Salarié(e)</SelectItem>
                      <SelectItem value="independant">Indépendant(e)</SelectItem>
                      <SelectItem value="chef_entreprise">Chef d'entreprise</SelectItem>
                      <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                      <SelectItem value="liberal">Profession libérale</SelectItem>
                      <SelectItem value="retraite">Retraité(e)</SelectItem>
                      <SelectItem value="sans_emploi">Sans emploi</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watch("professional_profile") === "autre" && (
                  <div>
                    <Label htmlFor="other_profile">Précisez votre profil professionnel</Label>
                    <Input
                      id="other_profile"
                      {...register("other_profile")}
                      placeholder="Précisez votre situation professionnelle"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="discovery_channel">Comment avez-vous découvert notre programme ? *</Label>
                  <Select onValueChange={(value) => setValue("discovery_channel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reseaux_sociaux">Réseaux sociaux</SelectItem>
                      <SelectItem value="moteur_recherche">Moteur de recherche</SelectItem>
                      <SelectItem value="bouche_oreille">Bouche à oreille</SelectItem>
                      <SelectItem value="presse">Presse/Média</SelectItem>
                      <SelectItem value="evenement">Événement</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watch("discovery_channel") === "autre" && (
                  <div>
                    <Label htmlFor="other_discovery_channel">Précisez comment vous avez découvert le programme</Label>
                    <Input
                      id="other_discovery_channel"
                      {...register("other_discovery_channel")}
                      placeholder="Précisez"
                    />
                  </div>
                )}
              </div>

              {/* Situation personnelle */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Situation personnelle
                </h3>

                <div>
                  <Label>Votre situation personnelle actuelle * (plusieurs choix possibles)</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    {[
                      { value: "celibataire", label: "Célibataire" },
                      { value: "en_couple", label: "En couple" },
                      { value: "marie", label: "Marié(e)" },
                      { value: "avec_enfants", label: "Avec enfants" },
                      { value: "sans_enfants", label: "Sans enfants" },
                      { value: "autre", label: "Autre" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`personal_${option.value}`}
                          checked={selectedPersonalSituation.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(option.value, checked as boolean, 'personal_situation')
                          }
                        />
                        <Label htmlFor={`personal_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPersonalSituation.includes("autre") && (
                  <div>
                    <Label htmlFor="other_personal_situation">Précisez votre situation personnelle</Label>
                    <Input
                      id="other_personal_situation"
                      {...register("other_personal_situation")}
                      placeholder="Précisez"
                    />
                  </div>
                )}
              </div>

              {/* Expérience politique */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Expérience politique
                </h3>

                <div>
                  <Label>Votre situation politique actuelle * (plusieurs choix possibles)</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    {[
                      { value: "membre_parti", label: "Membre d'un parti politique" },
                      { value: "elu_local", label: "Élu(e) local(e)" },
                      { value: "candidat", label: "Candidat(e) à une élection" },
                      { value: "militant_associatif", label: "Militant(e) associatif(ve)" },
                      { value: "citoyen_interesse", label: "Simple citoyen(ne) intéressé(e)" },
                      { value: "autre", label: "Autre" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`political_${option.value}`}
                          checked={selectedPoliticalSituation.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(option.value, checked as boolean, 'political_situation')
                          }
                        />
                        <Label htmlFor={`political_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPoliticalSituation.includes("autre") && (
                  <div>
                    <Label htmlFor="other_political_situation">Précisez votre situation politique</Label>
                    <Input
                      id="other_political_situation"
                      {...register("other_political_situation")}
                      placeholder="Précisez votre situation politique"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="leadership_qualities">Vos qualités de leadership *</Label>
                  <Textarea
                    id="leadership_qualities"
                    {...register("leadership_qualities", { required: "Ce champ est requis" })}
                    placeholder="Décrivez vos qualités de leadership"
                    className="min-h-[100px]"
                  />
                  {errors.leadership_qualities && (
                    <p className="text-red-500 text-sm mt-1">{errors.leadership_qualities.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="desired_transformation">Transformation désirée *</Label>
                  <Textarea
                    id="desired_transformation"
                    {...register("desired_transformation", { required: "Ce champ est requis" })}
                    placeholder="Quelle transformation souhaitez-vous apporter ?"
                    className="min-h-[100px]"
                  />
                  {errors.desired_transformation && (
                    <p className="text-red-500 text-sm mt-1">{errors.desired_transformation.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="coaching_experience">Expérience avec le coaching *</Label>
                  <Select onValueChange={(value) => setValue("coaching_experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aucune">Aucune expérience</SelectItem>
                      <SelectItem value="quelques_sessions">Quelques sessions</SelectItem>
                      <SelectItem value="reguliere">Expérience régulière</SelectItem>
                      <SelectItem value="extensive">Expérience extensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Obstacles et défis */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Obstacles et défis
                </h3>

                <div>
                  <Label>Obstacles perçus (plusieurs choix possibles)</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    {[
                      { value: "temps", label: "Manque de temps" },
                      { value: "argent", label: "Manque de moyens financiers" },
                      { value: "reseau", label: "Manque de réseau" },
                      { value: "connaissances", label: "Manque de connaissances" },
                      { value: "soutien", label: "Manque de soutien" },
                      { value: "confiance", label: "Manque de confiance" },
                      { value: "autre", label: "Autre" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`obstacle_${option.value}`}
                          checked={selectedObstacles.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(option.value, checked as boolean, 'obstacles')
                          }
                        />
                        <Label htmlFor={`obstacle_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedObstacles.includes("autre") && (
                  <div>
                    <Label htmlFor="other_obstacles">Précisez vos obstacles</Label>
                    <Input
                      id="other_obstacles"
                      {...register("other_obstacles")}
                      placeholder="Précisez vos obstacles"
                    />
                  </div>
                )}
              </div>

              {/* Préférences d'accompagnement */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Préférences d'accompagnement
                </h3>

                <div>
                  <Label htmlFor="preferred_topic">Sujet prioritaire d'accompagnement *</Label>
                  <Select onValueChange={(value) => setValue("preferred_topic", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strategie_campagne">Stratégie de campagne</SelectItem>
                      <SelectItem value="communication_publique">Communication publique</SelectItem>
                      <SelectItem value="fundraising">Levée de fonds</SelectItem>
                      <SelectItem value="constitution_equipe">Constitution d'équipe</SelectItem>
                      <SelectItem value="leadership">Développement du leadership</SelectItem>
                      <SelectItem value="gestion_stress">Gestion du stress</SelectItem>
                      <SelectItem value="negociation">Négociation politique</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="why_collaboration">Pourquoi souhaitez-vous collaborer avec nous ? *</Label>
                  <Textarea
                    id="why_collaboration"
                    {...register("why_collaboration", { required: "Ce champ est requis" })}
                    placeholder="Expliquez vos motivations"
                    className="min-h-[100px]"
                  />
                  {errors.why_collaboration && (
                    <p className="text-red-500 text-sm mt-1">{errors.why_collaboration.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="format_preference">Format préféré *</Label>
                    <Select onValueChange={(value) => setValue("format_preference", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presentiel">Présentiel</SelectItem>
                        <SelectItem value="visio">Visioconférence</SelectItem>
                        <SelectItem value="mixte">Mixte</SelectItem>
                        <SelectItem value="telephonique">Téléphonique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact_preference">Préférence de contact *</Label>
                    <Select onValueChange={(value) => setValue("contact_preference", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="telephone">Téléphone</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_period">Période de début souhaitée *</Label>
                    <Select onValueChange={(value) => setValue("start_period", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediat">Immédiatement</SelectItem>
                        <SelectItem value="1_mois">Dans 1 mois</SelectItem>
                        <SelectItem value="3_mois">Dans 3 mois</SelectItem>
                        <SelectItem value="6_mois">Dans 6 mois</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preferred_start_date">Date de début préférée</Label>
                    <Input
                      id="preferred_start_date"
                      type="date"
                      {...register("preferred_start_date")}
                    />
                  </div>
                </div>

                <div>
                  <Label>Options de confort (plusieurs choix possibles)</Label>
                  <div className="flex flex-col space-y-2 mt-2">
                    {[
                      { value: "preparation_media", label: "Préparation aux interviews et médias" },
                      { value: "prise_parole", label: "Formation à la prise de parole en public" },
                      { value: "strategie_politique", label: "Conseils en stratégie politique" },
                      { value: "recherche_financement", label: "Aide à la recherche de financement" },
                      { value: "constitution_equipe", label: "Constitution d'une équipe de campagne" },
                      { value: "gestion_stress", label: "Gestion du stress et de la pression" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`comfort_${option.value}`}
                          checked={selectedComfortOptions.includes(option.value)}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(option.value, checked as boolean, 'comfort_options')
                          }
                        />
                        <Label htmlFor={`comfort_${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Options de paiement */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Options de paiement
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_option">Option de paiement préférée *</Label>
                    <Select onValueChange={(value) => setValue("payment_option", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paiement_unique">Paiement unique</SelectItem>
                        <SelectItem value="paiement_echelonne">Paiement échelonné</SelectItem>
                        <SelectItem value="mensualite">Mensualités</SelectItem>
                        <SelectItem value="seance">Paiement par séance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="payment_method">Méthode de paiement préférée *</Label>
                    <Select onValueChange={(value) => setValue("payment_method", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carte_bancaire">Carte bancaire</SelectItem>
                        <SelectItem value="virement">Virement bancaire</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                        <SelectItem value="especes">Espèces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-coaching-600 hover:bg-coaching-700 text-white px-8 py-3 text-lg"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliticalLaunchForm;
