
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, BookOpen, Users, Flag, Rocket, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchOffers } from '@/services/offerService';
import { Offer } from '@/services/offerService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const getIconForTitle = (title: string) => {
  if (title.toLowerCase().includes('entretien')) return Users;
  if (title.toLowerCase().includes('affirme')) return BookOpen;
  if (title.toLowerCase().includes('politique') || title.toLowerCase().includes('ascension')) return Flag;
  return Rocket;
};

const Shop = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const fetchedOffers = await fetchOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOffers();
  }, []);

  // Filtrer les offres par catégorie si un filtre est sélectionné
  const filteredOffers = categoryFilter 
    ? offers.filter(offer => offer.category === categoryFilter)
    : offers;

  // Obtenir les catégories uniques pour le filtre
  const uniqueCategories = Array.from(
    new Set(offers.map(offer => offer.category))
  ).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-white/95">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 bg-white">
          <div className="container">
            <h1 className="text-4xl font-bold text-center mb-4 text-gold-900">Nos offres</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Découvrez nos différentes formules d'accompagnement adaptées à vos besoins personnels et professionnels.
              Notre objectif est de vous aider à atteindre vos ambitions politiques et professionnelles.
            </p>
            
            {/* Filtre par catégorie */}
            {uniqueCategories.length > 1 && (
              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select 
                    value={categoryFilter || ''} 
                    onValueChange={(val) => setCategoryFilter(val || null)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les catégories</SelectItem>
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category} value={category}>{
                          category === 'coaching' ? 'Coaching' :
                          category === 'formation' ? 'Formation' :
                          category === 'consultation' ? 'Consultation' :
                          category === 'masterclass' ? 'Masterclass' :
                          category
                        }</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucune offre disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOffers.map((offer) => {
                  const IconComponent = getIconForTitle(offer.title);
                  
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
                      
                      <CardContent className="py-4">
                        <p className="text-gray-600 text-sm line-clamp-3">{offer.description}</p>
                      </CardContent>
                      
                      <CardFooter className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-baseline">
                          <p className="text-lg font-bold text-gold-700">{offer.price} $ USD</p>
                        </div>
                        <Link to={`/strategic-consultation?offer=${encodeURIComponent(offer.title)}`}>
                          <Button className="bg-gold-600 hover:bg-gold-700">
                            Réserver
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
