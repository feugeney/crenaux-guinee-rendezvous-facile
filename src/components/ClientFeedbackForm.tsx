
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const ClientFeedbackForm = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !message) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([
          { 
            name, 
            role, 
            message, 
            email,
            approved: false // Testimonials need approval before being displayed
          }
        ]);

      if (error) throw error;
      
      toast.success("Merci pour votre témoignage! Il sera publié après modération.");
      setName('');
      setRole('');
      setMessage('');
      setEmail('');
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Error submitting testimonial:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-2 text-gold-800">Votre expérience</h2>
          <p className="text-center text-gray-600 mb-4 text-xs">
            Votre témoignage est précieux pour nous
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3 bg-gold-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Votre nom *" 
                required 
                className="text-sm"
              />
              <Input 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="Fonction / Titre"
                className="text-sm"
              />
            </div>
            
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email (non affiché)"
              className="text-sm"
            />
            
            <Textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Votre témoignage *" 
              required
              rows={2}
              className="text-sm resize-none"
            />
            
            <div className="text-right">
              <Button 
                type="submit" 
                className="bg-gold-600 hover:bg-gold-700 text-xs py-1" 
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <>Envoi...</>
                ) : (
                  <>
                    Envoyer <Send className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedbackForm;
