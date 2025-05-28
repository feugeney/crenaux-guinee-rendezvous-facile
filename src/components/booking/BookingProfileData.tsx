
import React from "react";
import { 
  formatRelationshipStatus, 
  formatBusinessType, 
  formatConsultationTopic 
} from "@/utils/formatters";

interface BookingProfileDataProps {
  gender?: string;
  relationshipStatus?: string;
  otherStatus?: string;
  professionalProfile?: string;
  businessType?: string;
  otherBusinessType?: string;
  topic?: string;
  otherTopic?: string;
}

const BookingProfileData: React.FC<BookingProfileDataProps> = ({
  gender,
  relationshipStatus,
  otherStatus,
  professionalProfile,
  businessType,
  otherBusinessType,
  topic,
  otherTopic
}) => {
  // Only render the component if we have any data to display
  const hasPersonalData = gender || relationshipStatus;
  const hasProfessionalData = professionalProfile || businessType;
  const hasTopicData = topic;
  
  if (!hasPersonalData && !hasProfessionalData && !hasTopicData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {hasPersonalData && (
        <div>
          <h3 className="font-semibold">Profil personnel</h3>
          {gender && <p>
            <span className="font-medium">Genre:</span> {gender === 'male' ? 'Homme' : 'Femme'}
          </p>}
          {relationshipStatus && <p>
            <span className="font-medium">Statut relationnel:</span> {
              formatRelationshipStatus(relationshipStatus, otherStatus)
            }
          </p>}
        </div>
      )}
      
      {hasProfessionalData && (
        <div>
          <h3 className="font-semibold">Profil professionnel</h3>
          {professionalProfile && <p>
            <span className="font-medium">Activité professionnelle:</span> {professionalProfile}
          </p>}
          {businessType && <p>
            <span className="font-medium">Type d'entreprise:</span> {
              formatBusinessType(businessType, otherBusinessType)
            }
          </p>}
        </div>
      )}

      {hasTopicData && (
        <div>
          <h3 className="font-semibold">Sujet de consultation</h3>
          <p>
            <span className="font-medium">Sujet principal:</span> {
              formatConsultationTopic(topic, otherTopic)
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingProfileData;
