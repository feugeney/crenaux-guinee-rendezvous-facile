
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  created_at: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        console.log('Testimonials data:', data);
        
        // Filter out the specific testimonial from Pola Christine YOMALO
        const filteredData = data ? data.filter(
          testimonial => testimonial.name !== 'Pola Christine YOMALO'
        ) : [];
        
        setTestimonials(filteredData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center">
        <div className="animate-pulse w-full max-w-2xl">
          <div className="h-8 bg-gray-200 rounded mb-3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="py-4 text-center">
        <h2 className="text-xl font-bold text-center mb-4 text-gold-800">Ce qu'en disent nos clients</h2>
        <p className="text-gray-500 italic">Aucun témoignage disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 className="text-xl font-bold text-center mb-6 text-gold-800">Ce qu'en disent nos clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gold-200 flex items-center justify-center text-gold-700 font-bold text-lg mr-3">
                {testimonial.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-sm">{testimonial.name}</h4>
                {testimonial.role && <p className="text-xs text-gray-500">{testimonial.role}</p>}
              </div>
            </div>
            <blockquote className="text-sm italic text-gray-700 border-l-3 border-gold-300 pl-3">
              "{testimonial.message.length > 100 ? `${testimonial.message.substring(0, 100)}...` : testimonial.message}"
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
