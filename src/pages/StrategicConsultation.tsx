
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { countryCodes, CountryCode } from "@/lib/countryCodes";

// Liste des pays pour le select de résidence
const countries = [
  "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre", "Angola", "Antigua-et-Barbuda", 
  "Arabie Saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan", "Bahamas", "Bahreïn", 
  "Bangladesh", "Barbade", "Belgique", "Belize", "Bénin", "Bhoutan", "Biélorussie", "Birmanie", "Bolivie", 
  "Bosnie-Herzégovine", "Botswana", "Brésil", "Brunei", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", 
  "Cameroun", "Canada", "Cap-Vert", "Centrafrique", "Chili", "Chine", "Chypre", "Colombie", "Comores", 
  "Congo", "Congo (RDC)", "Corée du Nord", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", 
  "Danemark", "Djibouti", "Dominique", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", 
  "Estonie", "Eswatini", "États-Unis", "Éthiopie", "Fidji", "Finlande", "France", "Gabon", "Gambie", "Géorgie", 
  "Ghana", "Grèce", "Grenade", "Guatemala", "Guinée", "Guinée équatoriale", "Guinée-Bissau", "Guyana", "Haïti", 
  "Honduras", "Hongrie", "Îles Marshall", "Îles Salomon", "Inde", "Indonésie", "Irak", "Iran", "Irlande", 
  "Islande", "Israël", "Italie", "Jamaïque", "Japon", "Jordanie", "Kazakhstan", "Kenya", "Kirghizistan", 
  "Kiribati", "Koweït", "Laos", "Lesotho", "Lettonie", "Liban", "Liberia", "Libye", "Liechtenstein", "Lituanie", 
  "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie", "Malawi", "Maldives", "Mali", "Malte", "Maroc", 
  "Maurice", "Mauritanie", "Mexique", "Micronésie", "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", 
  "Namibie", "Nauru", "Népal", "Nicaragua", "Niger", "Nigeria", "Niue", "Norvège", "Nouvelle-Zélande", "Oman", 
  "Ouganda", "Ouzbékistan", "Pakistan", "Palaos", "Palestine", "Panama", "Papouasie-Nouvelle-Guinée", "Paraguay", 
  "Pays-Bas", "Pérou", "Philippines", "Pologne", "Portugal", "Qatar", "République dominicaine", "République tchèque", 
  "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Saint-Kitts-et-Nevis", "Saint-Marin", "Saint-Vincent-et-les-Grenadines", 
  "Sainte-Lucie", "Salvador", "Samoa", "São Tomé-et-Principe", "Sénégal", "Serbie", "Seychelles", "Sierra Leone", 
  "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan", "Soudan du Sud", "Sri Lanka", "Suède", "Suisse", 
  "Suriname", "Syrie", "Tadjikistan", "Tanzanie", "Tchad", "Thaïlande", "Timor oriental", "Togo", "Tonga", 
  "Trinité-et-Tobago", "Tunisie", "Turkménistan", "Turquie", "Tuvalu", "Ukraine", "Uruguay", "Vanuatu", 
  "Vatican", "Venezuela", "Viêt Nam", "Yémen", "Zambie", "Zimbabwe"
];

// Profils professionnels
const professionalProfiles = [
  { value: "entrepreneur", label: "Entrepreneur(e)" },
  { value: "executive", label: "Haut cadre" },
  { value: "civil_servant", label: "Fonctionnaire" },
  { value: "mp", label: "Parlementaire (Député)" },
  { value: "local_elected", label: "Élu(e) local(e)" },
  { value: "retired", label: "Retraité(e)" },
  { value: "other", label: "Autre" }
];

// Tranches d'âge
const ageRanges = [
  { value: "under_35", label: "Moins de 35 ans" },
  { value: "35_45", label: "Entre 35 et 45 ans" },
  { value: "45_55", label: "Entre 45 et 55 ans" },
  { value: "over_55", label: "Plus de 55 ans" }
];

// Canaux de découverte
const discoveryChannels = [
  { value: "acquaintance", label: "Par une connaissance" },
  { value: "client_recommendation", label: "Sur recommandation client(e)" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter ou X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "threads", label: "Threads" },
  { value: "google_search", label: "Sur votre site via une recherche Google" },
  { value: "other", label: "Autre" }
];

const StrategicConsultation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+224", // Default to Guinea
    phone: "",
    whatsapp: "",
    professionalProfile: "",
    otherProfile: "",
    location: "",
    gender: "",
    relationshipStatus: "",
    otherStatus: "",
    ageRange: "",
    coachingExperience: "",
    whyDomani: "",
    discoveryChannel: "",
    otherDiscoveryChannel: "",
    preferredContact: "",
    consultationTopic: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName) {
      toast({
        title: "Champ obligatoire",
        description: "Veuillez saisir votre nom complet.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: "Champ obligatoire",
        description: "Veuillez saisir votre adresse e-mail.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone) {
      toast({
        title: "Champ obligatoire",
        description: "Veuillez saisir votre numéro de téléphone.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.professionalProfile) {
      toast({
        title: "Champ obligatoire",
        description: "Veuillez sélectionner votre profil professionnel.",
        variant: "destructive",
      });
      return;
    }
    
    // Format phone with country code
    const formattedPhone = `${formData.countryCode} ${formData.phone}`;
    const dataToSend = {
      ...formData,
      phone: formattedPhone,
    };

    // Navigate to time selection with form data
    navigate("/time-selection", { state: { formData: dataToSend } });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-left mb-2 text-amber-600">
        BILAN STRATÉGIQUE
      </h1>
      <h2 className="text-xl text-left mb-8 text-amber-600 font-semibold">
        30 MINUTES POUR CLARIFIER TA SITUATION ACTUELLE AVEC MOI EN PRIVÉ
      </h2>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-left">Réservez votre entretien en privé</CardTitle>
          <CardDescription className="text-base text-left">
            <p className="mb-4">Bonjour et si fière de vous retrouver ici.</p>
            
            <p className="mb-4">Fatigué(e) de tourner en rond, besoin de direction claire ?</p>
            
            <p className="mb-4">Tu veux passer un cap dans ta carrière politique ou professionnelle… mais quelque chose bloque.</p>
            
            <p className="mb-4">En 30 minutes chrono en ligne via zoom, je t'aide à identifier précisément où tu en es, ce qui te freine, et ce que tu dois faire maintenant pour reprendre la main, identifier tes atouts et avancer sereinement.</p>

            <p className="font-semibold mt-6 mb-2 text-left">Ce qu'on fera ensemble :</p>
            
            <ol className="list-decimal ml-5 mb-4 text-left">
              <li><span className="font-semibold">Vision</span> - Tu auras des réponses à tes doutes, à tes questions.</li>
              <li><span className="font-semibold">Plan d'Action</span> - Je te livre un diagnostic sans détour à la suite de notre échange + les 3 priorités à mettre en œuvre immédiatement pour faire un saut qualitatif dans ton parcours.</li>
            </ol>
            
            <p className="font-semibold mb-2 text-left">Comment ça se passe ?</p>
            
            <p className="mb-4 text-left">→ Tu réponds à ce mini questionnaire pour que je cerne ton profil et comprenne tes attentes afin de profiter pleinement de nos 30 minutes ensemble.</p>
            
            <p className="font-semibold mb-2 text-left">Tu gagnes :</p>
            
            <ul className="list-disc ml-5 mb-4 text-left">
              <li>Des mois de doutes évités</li>
              <li>Une boussole claire pour tes prochains pas</li>
              <li>Une analyse professionnelle basée sur mon expérience réelle du pouvoir</li>
            </ul>
            
            <p className="italic mb-4 text-left">(La réservation étant obligatoire à l'avance au regard des places limitées chaque mois, prière de remplir le formulaire à présent s'il vous plaît et à nos succès mérités).</p>
            
            <p className="font-semibold text-left">DOMANI DORÉ</p>
            <p className="text-left">Coach, consultante en leadership politique, Ancienne Ministre, et parlementaire</p>
            <p className="text-left">Fondatrice associée du cabinet Dom Consulting</p>
            <p className="text-left">Leader du coaching politique en Afrique francophone</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations Personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-left">Informations personnelles</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-left block">Nom complet *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre nom et prénom"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block">Adresse e-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Entrez votre adresse e-mail"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-left block">Numéro de téléphone *</Label>
                  <div className="flex">
                    <Select
                      name="countryCode"
                      value={formData.countryCode}
                      onValueChange={(value) => handleSelectChange("countryCode", value)}
                    >
                      <SelectTrigger className="w-[140px] mr-2">
                        <SelectValue placeholder="Indicatif" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countryCodes.map((country: CountryCode) => (
                          <SelectItem key={country.code} value={country.dial_code}>
                            {country.name} ({country.dial_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Numéro de téléphone"
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-left block">Numéro WhatsApp (si différent)</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Entrez votre numéro WhatsApp si différent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-left block">Pays de résidence *</Label>
                  <Select
                    name="location"
                    value={formData.location}
                    onValueChange={(value) => handleSelectChange("location", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre pays de résidence" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Profil Personnel */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-left">Profil personnel</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-left block">Genre *</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleRadioChange("gender", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Homme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Femme</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-left block">Statut relationnel *</Label>
                  <Select
                    name="relationshipStatus"
                    value={formData.relationshipStatus}
                    onValueChange={(value) => handleSelectChange("relationshipStatus", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre statut relationnel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Célibataire</SelectItem>
                      <SelectItem value="married">Marié(e)</SelectItem>
                      <SelectItem value="relationship">En couple</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.relationshipStatus === "other" && (
                    <Input
                      id="otherStatus"
                      name="otherStatus"
                      value={formData.otherStatus}
                      onChange={handleInputChange}
                      placeholder="Précisez votre statut"
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ageRange" className="text-left block">Votre tranche d'âge SVP *</Label>
                  <Select
                    name="ageRange"
                    value={formData.ageRange}
                    onValueChange={(value) => handleSelectChange("ageRange", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre tranche d'âge" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Profil professionnel */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-left">Profil professionnel *</h3>
              
              <div className="space-y-2">
                <Select
                  name="professionalProfile"
                  value={formData.professionalProfile}
                  onValueChange={(value) => handleSelectChange("professionalProfile", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre profil professionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalProfiles.map((profile) => (
                      <SelectItem key={profile.value} value={profile.value}>
                        {profile.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.professionalProfile === "other" && (
                  <Input
                    id="otherProfile"
                    name="otherProfile"
                    value={formData.otherProfile}
                    onChange={handleInputChange}
                    placeholder="Précisez votre profil"
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* Consultation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-left">Consultation</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultationTopic" className="text-left block">Quel est le sujet que vous aimeriez qu'on aborde amplement lors de cet entretien stratégique ? *</Label>
                  <Textarea
                    id="consultationTopic"
                    name="consultationTopic"
                    value={formData.consultationTopic}
                    onChange={handleInputChange}
                    placeholder="Décrivez le sujet que vous souhaitez aborder"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coachingExperience" className="text-left block">Avez-vous déjà fait recours à un(e) coach ? Si oui, qu'est ce que vous n'avez pas aimé dans cette expérience passée ? Si non, merci de le préciser SVP *</Label>
                  <Textarea
                    id="coachingExperience"
                    name="coachingExperience"
                    value={formData.coachingExperience}
                    onChange={handleInputChange}
                    placeholder="Partagez votre expérience avec d'autres coaches"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whyDomani" className="text-left block">Pourquoi pensez-vous que je suis la bonne personne pour vous orienter ou vous conseiller en ce moment précisément ? *</Label>
                  <Textarea
                    id="whyDomani"
                    name="whyDomani"
                    value={formData.whyDomani}
                    onChange={handleInputChange}
                    placeholder="Expliquez pourquoi vous avez choisi de consulter Domani Doré"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-left block">Comment avez-vous entendu parler des services du cabinet Dom Consulting et de mes accompagnements SVP ? *</Label>
                  <Select
                    name="discoveryChannel"
                    value={formData.discoveryChannel}
                    onValueChange={(value) => handleSelectChange("discoveryChannel", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez comment vous nous avez découvert" />
                    </SelectTrigger>
                    <SelectContent>
                      {discoveryChannels.map((channel) => (
                        <SelectItem key={channel.value} value={channel.value}>
                          {channel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {formData.discoveryChannel === "other" && (
                    <Input
                      id="otherDiscoveryChannel"
                      name="otherDiscoveryChannel"
                      value={formData.otherDiscoveryChannel}
                      onChange={handleInputChange}
                      placeholder="Précisez le canal"
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-left block">Par quel canal êtes-vous plus réactif pour vous recontacter rapidement en raison des créneaux de réservation à l'avance SVP ? *</Label>
                  <RadioGroup
                    value={formData.preferredContact}
                    onValueChange={(value) => handleRadioChange("preferredContact", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-contact" />
                      <Label htmlFor="email-contact">Par email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp-contact" />
                      <Label htmlFor="whatsapp-contact">Via WhatsApp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both-contact" />
                      <Label htmlFor="both-contact">Via les deux</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Continuer
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <div className="text-sm text-gray-500">
            * Champs obligatoires
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StrategicConsultation;
