
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

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

const countries: Country[] = [
  // Pays européens
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "33" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪", phoneCode: "49" },
  { code: "ES", name: "Espagne", flag: "🇪🇸", phoneCode: "34" },
  { code: "IT", name: "Italie", flag: "🇮🇹", phoneCode: "39" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "351" },
  { code: "BE", name: "Belgique", flag: "🇧🇪", phoneCode: "32" },
  { code: "CH", name: "Suisse", flag: "🇨🇭", phoneCode: "41" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", phoneCode: "352" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", phoneCode: "377" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧", phoneCode: "44" },
  { code: "AT", name: "Autriche", flag: "🇦🇹", phoneCode: "43" },
  { code: "NL", name: "Pays-Bas", flag: "🇳🇱", phoneCode: "31" },
  { code: "SE", name: "Suède", flag: "🇸🇪", phoneCode: "46" },
  { code: "NO", name: "Norvège", flag: "🇳🇴", phoneCode: "47" },
  { code: "DK", name: "Danemark", flag: "🇩🇰", phoneCode: "45" },
  { code: "FI", name: "Finlande", flag: "🇫🇮", phoneCode: "358" },
  { code: "PL", name: "Pologne", flag: "🇵🇱", phoneCode: "48" },
  { code: "CZ", name: "République tchèque", flag: "🇨🇿", phoneCode: "420" },
  { code: "GR", name: "Grèce", flag: "🇬🇷", phoneCode: "30" },
  
  // Pays africains
  { code: "DZ", name: "Algérie", flag: "🇩🇿", phoneCode: "213" },
  { code: "MA", name: "Maroc", flag: "🇲🇦", phoneCode: "212" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳", phoneCode: "216" },
  { code: "EG", name: "Égypte", flag: "🇪🇬", phoneCode: "20" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", phoneCode: "234" },
  { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦", phoneCode: "27" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", phoneCode: "254" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", phoneCode: "233" },
  { code: "ET", name: "Éthiopie", flag: "🇪🇹", phoneCode: "251" },
  { code: "UG", name: "Ouganda", flag: "🇺🇬", phoneCode: "256" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳", phoneCode: "221" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", phoneCode: "225" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", phoneCode: "237" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", phoneCode: "226" },
  { code: "ML", name: "Mali", flag: "🇲🇱", phoneCode: "223" },
  { code: "NE", name: "Niger", flag: "🇳🇪", phoneCode: "227" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", phoneCode: "235" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", phoneCode: "250" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", phoneCode: "261" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", phoneCode: "265" },
  
  // Autres pays
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "1" },
  { code: "US", name: "États-Unis", flag: "🇺🇸", phoneCode: "1" },
  { code: "other", name: "Autre", flag: "🌐", phoneCode: "" }
];

interface PoliticalLaunchFormValues {
  full_name: string;
  email: string;
  country_residence: string;
  phone: string;
  country_code: string;
  personal_situation: string;
  other_personal_situation?: string;
  motivation: string;
  political_situation: string;
  other_political_situation?: string;
  political_experience?: string;
  skills: string;
  obstacles?: string[];
  comfort_options?: string[];
  additional_info?: string;
  accept_terms: boolean;
}

const PoliticalLaunchForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PoliticalLaunchFormValues>();

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    if (country) {
      setValue("country_code", `+${country.phoneCode}`);
    } else {
      setValue("country_code", "+XX");
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        personal_situation: Array.isArray(data.personal_situation) ? data.personal_situation : [data.personal_situation],
        political_situation: Array.isArray(data.political_situation) ? data.political_situation : [data.political_situation],
        obstacles: data.obstacles ? (Array.isArray(data.obstacles) ? data.obstacles : [data.obstacles]) : [],
        comfort_options: data.comfort_options ? (Array.isArray(data.comfort_options) ? data.comfort_options : [data.comfort_options]) : []
      };

      const { error } = await supabase
        .from('political_launch_applications')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Candidature envoyée avec succès",
        description: "Nous reviendrons vers vous dans les plus brefs délais.",
      });

      // Redirect to success page
      window.location.href = '/political-launch-success';
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre candidature.",
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
                      <p className="text-red-500 text-sm mt-1">{errors.full_name.message as string}</p>
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
                          value: /^\S+@\S+$/i,
                          message: "Email invalide"
                        }
                      })}
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country_residence">Pays de résidence *</Label>
                    <Select 
                      onValueChange={(value) => {
                        setValue("country_residence", value);
                        handleCountryChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                        <span className="text-sm font-medium">
                          {watch("country_code") || "+XX"}
                        </span>
                      </div>
                      <Input
                        id="phone"
                        {...register("phone", { required: "Le numéro de téléphone est requis" })}
                        placeholder="123456789"
                        className="rounded-l-none"
                      />
                    </div>
                    <input type="hidden" {...register("country_code")} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="personal_situation">Situation personnelle *</Label>
                  <Select onValueChange={(value) => setValue("personal_situation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant(e)</SelectItem>
                      <SelectItem value="employed">Salarié(e)</SelectItem>
                      <SelectItem value="self_employed">Indépendant(e)</SelectItem>
                      <SelectItem value="unemployed">Sans emploi</SelectItem>
                      <SelectItem value="retired">Retraité(e)</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watch("personal_situation") === "other" && (
                  <div>
                    <Label htmlFor="other_personal_situation">Précisez votre situation</Label>
                    <Input
                      id="other_personal_situation"
                      {...register("other_personal_situation")}
                      placeholder="Précisez votre situation personnelle"
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
                  <Label htmlFor="motivation">Motivation *</Label>
                  <Textarea
                    id="motivation"
                    {...register("motivation", { required: "La motivation est requise" })}
                    placeholder="Décrivez votre motivation à vous lancer en politique"
                    className="min-h-[100px]"
                  />
                  {errors.motivation && (
                    <p className="text-red-500 text-sm mt-1">{errors.motivation.message as string}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="political_situation">Situation politique actuelle *</Label>
                  <Select onValueChange={(value) => setValue("political_situation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre situation politique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member_of_party">Membre d'un parti politique</SelectItem>
                      <SelectItem value="elected_official">Élu(e) local(e)</SelectItem>
                      <SelectItem value="candidate">Candidat(e) à une élection</SelectItem>
                      <SelectItem value="activist">Militant(e) associatif(ve)</SelectItem>
                      <SelectItem value="citizen">Simple citoyen(ne) intéressé(e)</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watch("political_situation") === "other" && (
                  <div>
                    <Label htmlFor="other_political_situation">Précisez votre situation</Label>
                    <Input
                      id="other_political_situation"
                      {...register("other_political_situation")}
                      placeholder="Précisez votre situation politique"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="political_experience">Expérience politique (si applicable)</Label>
                  <Textarea
                    id="political_experience"
                    {...register("political_experience")}
                    placeholder="Décrivez votre expérience politique"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Compétences et obstacles */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Compétences et obstacles
                </h3>

                <div>
                  <Label htmlFor="skills">Vos atouts et compétences *</Label>
                  <Textarea
                    id="skills"
                    {...register("skills", { required: "Vos atouts et compétences sont requis" })}
                    placeholder="Décrivez vos atouts et compétences pour réussir en politique"
                    className="min-h-[100px]"
                  />
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills.message as string}</p>
                  )}
                </div>

                <div>
                  <Label>Obstacles perçus</Label>
                  <div className="flex flex-col space-y-2">
                    <div>
                      <Checkbox id="obstacle_time" {...register("obstacles")} value="time" />
                      <Label htmlFor="obstacle_time" className="ml-2">Manque de temps</Label>
                    </div>
                    <div>
                      <Checkbox id="obstacle_money" {...register("obstacles")} value="money" />
                      <Label htmlFor="obstacle_money" className="ml-2">Manque de moyens financiers</Label>
                    </div>
                    <div>
                      <Checkbox id="obstacle_network" {...register("obstacles")} value="network" />
                      <Label htmlFor="obstacle_network" className="ml-2">Manque de réseau</Label>
                    </div>
                    <div>
                      <Checkbox id="obstacle_knowledge" {...register("obstacles")} value="knowledge" />
                      <Label htmlFor="obstacle_knowledge" className="ml-2">Manque de connaissances</Label>
                    </div>
                    <div>
                      <Checkbox id="obstacle_support" {...register("obstacles")} value="support" />
                      <Label htmlFor="obstacle_support" className="ml-2">Manque de soutien</Label>
                    </div>
                    <div>
                      <Checkbox id="obstacle_other" {...register("obstacles")} value="other" />
                      <Label htmlFor="obstacle_other" className="ml-2">Autre</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options de confort */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Options de confort
                </h3>

                <div>
                  <Label>Ce qui vous mettrait le plus à l'aise</Label>
                  <div className="flex flex-col space-y-2">
                    <div>
                      <Checkbox id="comfort_media" {...register("comfort_options")} value="media" />
                      <Label htmlFor="comfort_media" className="ml-2">Préparation aux interviews et médias</Label>
                    </div>
                    <div>
                      <Checkbox id="comfort_speaking" {...register("comfort_options")} value="speaking" />
                      <Label htmlFor="comfort_speaking" className="ml-2">Formation à la prise de parole en public</Label>
                    </div>
                    <div>
                      <Checkbox id="comfort_strategy" {...register("comfort_options")} value="strategy" />
                      <Label htmlFor="comfort_strategy" className="ml-2">Conseils en stratégie politique</Label>
                    </div>
                    <div>
                      <Checkbox id="comfort_funding" {...register("comfort_options")} value="funding" />
                      <Label htmlFor="comfort_funding" className="ml-2">Aide à la recherche de financement</Label>
                    </div>
                    <div>
                      <Checkbox id="comfort_team" {...register("comfort_options")} value="team" />
                      <Label htmlFor="comfort_team" className="ml-2">Constitution d'une équipe de campagne</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations complémentaires */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-coaching-800 border-b pb-2">
                  Informations complémentaires
                </h3>

                <div>
                  <Label htmlFor="additional_info">Informations complémentaires</Label>
                  <Textarea
                    id="additional_info"
                    {...register("additional_info")}
                    placeholder="Si vous souhaitez ajouter des informations complémentaires, faites-le ici"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Conditions générales */}
              <div className="flex items-center space-x-2">
                <Checkbox id="accept_terms" {...register("accept_terms", { required: "Vous devez accepter les conditions générales" })} />
                <Label htmlFor="accept_terms">
                  J'accepte les <a href="#" className="text-coaching-600 hover:underline">conditions générales</a> *
                </Label>
                {errors.accept_terms && (
                  <p className="text-red-500 text-sm mt-1">{errors.accept_terms.message as string}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-coaching-600 hover:bg-coaching-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliticalLaunchForm;
