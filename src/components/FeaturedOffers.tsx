
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, BookOpen, Users, Flag, Rocket } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
}

const getIconForTitle = (title: string) => {
  if (title.toLowerCase().includes('entretien')) return Users;
  if (title.toLowerCase().includes('affirme')) return BookOpen;
  if (title.toLowerCase().includes('politique') || title.toLowerCase().includes('ascension') || title.toLowerCase().includes('lancement')) return Flag;
  return Rocket;
};

const FeaturedOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        console.log("Offers fetched:", data);
        setOffers(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const getOfferLink = (offer: Offer) => {
    // Si c'est l'offre de lancement politique, rediriger vers /political-launch
    if (offer.title.toLowerCase().includes('lancement') && offer.title.toLowerCase().includes('politique')) {
      return '/political-launch';
    }
    // Sinon, rediriger vers strategic-consultation avec le paramètre offer
    return `/strategic-consultation?offer=${encodeURIComponent(offer.title)}`;
  };

  if (isLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-4 text-gold-900">Nos offres</h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Découvrez nos différentes formules d'accompagnement adaptées à vos besoins spécifiques.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer) => {
          const IconComponent = getIconForTitle(offer.title);
          const offerLink = getOfferLink(offer);
          
          return (
            <Card key={offer.id} className="hover:shadow-lg transition-all duration-300 border-gold-100 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={offer.image_url && offer.image_url.trim() !== '' ? offer.image_url : "/lovable-uploads/f653ae10-5515-4866-88c7-0173d547d222.png"} 
                  alt={offer.title}
                  className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500"
                  onError={(e) => {
                    // En cas d'erreur, utiliser l'image par défaut
                    (e.target as HTMLImageElement).src = "/lovable-uploads/f653ae10-5515-4866-88c7-0173d547d222.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center mb-2">
                      <IconComponent className="h-5 w-5 text-gold-700" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600 text-sm">{offer.description}</CardDescription>
              </CardHeader>
              
              <CardFooter className="flex items-center justify-between pt-2 border-t border-gold-100">
                <div className="flex items-baseline">
                  <p className="text-lg font-bold text-gold-700">{offer.price} $ USD</p>
                </div>
                <Link to={offerLink}>
                  <Button className="bg-gold-600 hover:bg-gold-700">
                    {offerLink === '/political-launch' ? 'Candidater' : 'Réserver'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default FeaturedOffers;
