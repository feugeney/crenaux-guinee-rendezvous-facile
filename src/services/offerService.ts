
import { supabase } from "@/lib/supabase";

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  featured: boolean;
  created_at: string;
  category: string;
}

export const fetchOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
  return data || [];
};

export const createOffer = async (offer: Partial<Offer>) => {
  console.log("Creating offer:", offer);
  const { data, error } = await supabase
    .from('offers')
    .insert([{
      title: offer.title,
      description: offer.description,
      price: offer.price || 0,
      image_url: offer.image_url || "",
      featured: offer.featured || false,
      category: offer.category || "coaching"
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
  return data;
};

export const updateOffer = async (id: string, offer: Partial<Offer>) => {
  console.log("Updating offer:", id, offer);
  const { data, error } = await supabase
    .from('offers')
    .update({
      title: offer.title,
      description: offer.description,
      price: offer.price || 0,
      image_url: offer.image_url || "",
      featured: offer.featured || false,
      category: offer.category || "coaching"
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
  return data;
};

export const deleteOffer = async (id: string) => {
  console.log("Deleting offer:", id);
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
  return true;
};

export const getOfferById = async (id: string) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching offer by ID:', error);
    throw error;
  }
  return data as Offer;
};

export const getFeaturedOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching featured offers:', error);
    throw error;
  }
  return data || [];
};

export const getOffersByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching offers by category:', error);
    throw error;
  }
  return data || [];
};
