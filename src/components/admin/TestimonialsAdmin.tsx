
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  message: string;
  email: string | null;
  created_at: string | null;
  approved: boolean | null;
}

const TestimonialsAdmin = () => {
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      // Fetch pending testimonials
      const { data: pendingData, error: pendingError } = await supabase
        .from('pending_testimonials')
        .select('*');

      if (pendingError) throw pendingError;

      // Fetch approved testimonials
      const { data: approvedData, error: approvedError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true);

      if (approvedError) throw approvedError;

      setPendingTestimonials(pendingData as Testimonial[] || []);
      setApprovedTestimonials(approvedData || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;

      toast.success('Témoignage approuvé avec succès');
      fetchTestimonials();
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast.error('Erreur lors de l\'approbation du témoignage');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Témoignage supprimé avec succès');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Erreur lors de la suppression du témoignage');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des témoignages</h2>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'pending' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('pending')}
            size="sm"
          >
            En attente ({pendingTestimonials.length})
          </Button>
          <Button 
            variant={activeTab === 'approved' ? 'default' : 'outline'}
            onClick={() => setActiveTab('approved')}
            size="sm"
          >
            Approuvés ({approvedTestimonials.length})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <p>Chargement des témoignages...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'pending' ? (
            pendingTestimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell>{testimonial.role}</TableCell>
                      <TableCell className="max-w-sm truncate">{testimonial.message}</TableCell>
                      <TableCell>{testimonial.email}</TableCell>
                      <TableCell>{testimonial.created_at && new Date(testimonial.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => handleApprove(testimonial.id)} 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDelete(testimonial.id)} 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-32 flex items-center justify-center border rounded-md">
                <p className="text-gray-500">Aucun témoignage en attente d'approbation</p>
              </div>
            )
          ) : (
            approvedTestimonials.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell>{testimonial.role}</TableCell>
                      <TableCell className="max-w-sm truncate">{testimonial.message}</TableCell>
                      <TableCell>{testimonial.email}</TableCell>
                      <TableCell>{testimonial.created_at && new Date(testimonial.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleDelete(testimonial.id)} 
                          variant="ghost" 
                          size="sm"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-32 flex items-center justify-center border rounded-md">
                <p className="text-gray-500">Aucun témoignage approuvé</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TestimonialsAdmin;
