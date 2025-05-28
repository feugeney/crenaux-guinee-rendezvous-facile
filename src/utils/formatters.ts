
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formats a date string for display in French locale
 * @param dateString - Date string to format
 * @param defaultValue - Default value to return if dateString is falsy
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, defaultValue: string = "Non spécifié"): string => {
  if (!dateString) return defaultValue;
  
  try {
    const date = parseISO(dateString);
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    console.error("Error formatting date:", error);
    return defaultValue;
  }
};

/**
 * Formats a relationship status into a human-readable French string
 * @param status - The relationship status code
 * @param otherStatus - Custom status text (when status is "other")
 * @returns Formatted relationship status
 */
export const formatRelationshipStatus = (
  status?: string, 
  otherStatus?: string
): string => {
  if (!status) return "Non spécifié";
  
  switch(status) {
    case 'single': return 'Célibataire';
    case 'married': return 'Marié(e)';
    case 'relationship': return 'En couple';
    default: return otherStatus || 'Autre';
  }
};

/**
 * Formats a business type into a human-readable French string
 * @param type - The business type code
 * @param otherType - Custom business type text (when type is "other")
 * @returns Formatted business type
 */
export const formatBusinessType = (
  type?: string, 
  otherType?: string
): string => {
  if (!type) return "Non spécifié";
  
  switch(type) {
    case 'startup': return 'Startup';
    case 'established': return 'Entreprise établie';
    case 'selfEmployed': return 'Auto-entrepreneur';
    case 'planning': return 'En phase de planification';
    default: return otherType || 'Autre';
  }
};

/**
 * Formats a consultation topic into a human-readable French string
 * @param topic - The topic code
 * @param otherTopic - Custom topic text (when topic is "other")
 * @returns Formatted topic
 */
export const formatConsultationTopic = (
  topic?: string, 
  otherTopic?: string
): string => {
  if (!topic) return "Non spécifié";
  
  switch(topic) {
    case 'businessCreation': return 'Création d\'entreprise';
    case 'businessStrategy': return 'Stratégie d\'entreprise';
    case 'digitalTransformation': return 'Transformation digitale';
    case 'financialStrategy': return 'Stratégie financière';
    case 'careerChange': return 'Reconversion professionnelle';
    default: return otherTopic || 'Autre';
  }
};
