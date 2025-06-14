
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle,
  CreditCard,
  Eye
} from 'lucide-react';

interface PoliticalApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city_country: string;
  status: string;
  payment_option: string;
  format_preference: string;
  proposed_schedule?: {
    program_start_date: string;
    intensive_sessions: string[];
    follow_up_start: string;
    follow_up_end: string;
    admin_notes?: string;
  };
  created_at: string;
}

interface Props {
  application: PoliticalApplication;
  showSchedule?: boolean;
  onViewDetails?: (id: string) => void;
}

const PoliticalApplicationCard: React.FC<Props> = ({ 
  application, 
  showSchedule = false,
  onViewDetails 
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En attente</Badge>;
      case 'validated':
        return <Badge className="bg-green-100 text-green-800">Validée</Badge>;
      case 'payment_pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Paiement en attente</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-100 text-purple-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPrice = (paymentOption: string) => {
    return paymentOption.includes('entièrement') ? 1500 : 1800;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{application.full_name}</CardTitle>
              <p className="text-sm text-gray-500">
                Candidature du {formatDate(application.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(application.status)}
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(application.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{application.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{application.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{application.city_country}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span>{getPrice(application.payment_option)}$ USD</span>
          </div>
        </div>

        {/* Planning des séances (si disponible et demandé) */}
        {showSchedule && application.proposed_schedule && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              Planning des séances
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-700">Début du programme:</span>
                <p className="text-sm font-medium">
                  {formatDate(application.proposed_schedule.program_start_date)}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-700">
                  Séances intensives ({application.proposed_schedule.intensive_sessions.length} séances):
                </span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {application.proposed_schedule.intensive_sessions.map((session, index) => (
                    <div key={index} className="text-xs bg-white px-2 py-1 rounded border">
                      <Clock className="h-3 w-3 inline mr-1 text-gray-500" />
                      Séance {index + 1}: {formatDate(session)}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-700">Période de suivi:</span>
                <p className="text-sm">
                  Du {formatDate(application.proposed_schedule.follow_up_start)} au{' '}
                  {formatDate(application.proposed_schedule.follow_up_end)}
                </p>
              </div>

              {application.proposed_schedule.admin_notes && (
                <div>
                  <span className="text-xs font-medium text-gray-700">Notes:</span>
                  <p className="text-sm text-gray-600 italic">
                    {application.proposed_schedule.admin_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliticalApplicationCard;
