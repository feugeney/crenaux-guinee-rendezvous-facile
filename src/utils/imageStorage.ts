
import { supabase } from "@/lib/supabase";

// Fonction pour convertir une image en base64 vers un blob
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const base64Data = base64.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Fonction pour générer un nom de fichier unique
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'jpg';
  return `offer_${timestamp}_${randomString}.${extension}`;
};

// Fonction pour sauvegarder l'image localement et retourner un lien court
export const saveImageToProject = async (imageData: string, fileName?: string): Promise<string> => {
  try {
    // Si c'est déjà une URL, la retourner telle quelle
    if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      return imageData;
    }

    // Si c'est un base64, le traiter
    if (imageData.startsWith('data:image/')) {
      const mimeType = imageData.split(';')[0].split(':')[1];
      const blob = base64ToBlob(imageData, mimeType);
      
      // Générer un nom de fichier unique
      const uniqueFileName = fileName ? generateUniqueFileName(fileName) : generateUniqueFileName('image.jpg');
      
      // Créer une URL blob temporaire
      const blobUrl = URL.createObjectURL(blob);
      
      // Stocker les métadonnées de l'image dans la base de données
      const { data, error } = await supabase
        .from('offer_images')
        .insert([{
          filename: uniqueFileName,
          original_url: imageData,
          blob_url: blobUrl,
          mime_type: mimeType,
          size: blob.size
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la sauvegarde des métadonnées:', error);
        throw error;
      }

      // Retourner un lien court basé sur l'ID
      return `/api/images/${data.id}`;
    }

    return imageData;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'image:', error);
    throw error;
  }
};

// Fonction pour récupérer l'image par son ID
export const getImageById = async (imageId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('offer_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (error || !data) {
      console.error('Image non trouvée:', error);
      return null;
    }

    return data.blob_url || data.original_url;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image:', error);
    return null;
  }
};
