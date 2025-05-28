
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedOffers from '@/components/FeaturedOffers';
import ClientFeedbackForm from '@/components/ClientFeedbackForm';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Biography */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Bonjour, je suis <span className="text-gold-700">Domani Doré</span>
                </h1>
                <div className="prose prose-lg text-gray-700">
                  <p>
                    À 29 ans, je suis devenue la plus jeune Ministre de l'histoire de mon pays, jusqu'à nos jours.
                  </p>
                  <p>
                    Depuis, j'ai été parlementaire, directrice de campagne et porte-parole d'un parti présidentiel, 
                    candidate indépendante et élue communale, aujourd'hui, co-fondatrice de Dom Consulting, le cabinet 
                    leader du coaching politique sur mesure en Afrique francophone.
                  </p>
                  <p>
                    J'aide les leaders, surtout les femmes ambitieuses à transformer leurs idées en actions concrètes, 
                    à préparer leurs candidatures électorales, et à conquérir leur place dans les sphères de décision 
                    en milieu professionnel.
                  </p>
                
                  <p className="font-semibold italic text-gold-700">
                    Parce qu'on ne change pas le monde en silence, on l'influence....
                  </p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  {/* Logo overlay */}
                  <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg z-10">
                    <img 
                      src="/lovable-uploads/e6025925-4f10-4a38-8780-a74241fe823d.png"
                      alt="Logo DomConsulting"
                      className="h-16 w-16"
                    />
                  </div>
                  {/* Main profile image */}
                  <img 
                    src="/lovable-uploads/bf4a0354-13be-43ba-98a9-a4dbd932fd80.png"
                    alt="Domani Doré Portrait" 
                    className="rounded-lg shadow-2xl max-w-full"
                    style={{maxWidth: "550px", width: "100%"}}
                  />
                  {/* Decorative element */}
                  <div className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-white border border-gold-100 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Offers Section - Now with white background */}
        <section className="py-16 border-t border-b border-gray-100">
          <div className="container mx-auto px-4">
            <FeaturedOffers />
          </div>
        </section>

        {/* Testimonials Section - Now with white background */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Testimonials />
          </div>
        </section>

        {/* Client Feedback Form Section */}
        <ClientFeedbackForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
