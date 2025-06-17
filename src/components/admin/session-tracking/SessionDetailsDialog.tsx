
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Play, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaidApplication, SessionSchedule } from './types';
import { getSessionStatusAndColor } from './sessionUtils';

interface SessionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: PaidApplication | null;
  sessions: SessionSchedule[];
  followUpSessions: SessionSchedule[];
  getStatusBadge: (application: PaidApplication) => React.ReactElement;
  getCompletionPercentage: (application: PaidApplication) => number;
  updateSessionStatus: (sessionIndex: number, completed: boolean, isFollowUp?: boolean) => void;
}

export const SessionDetailsDialog = ({
  open,
  onOpenChange,
  application,
  sessions,
  followUpSessions,
  getStatusBadge,
  getCompletionPercentage,
  updateSessionStatus
}: SessionDetailsDialogProps) => {
  if (!application) return null;

  const allSessions = [...sessions, ...followUpSessions];

  const handleFollowSessions = () => {
    // Cette fonction peut être étendue pour ouvrir une nouvelle vue de suivi
    console.log('Suivre les séances pour:', application.full_name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Planning - {application.full_name}</span>
            <Button
              onClick={handleFollowSessions}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Suivre les séances
            </Button>
          </DialogTitle>
          <DialogDescription>
            Planning des séances approuvées
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de la candidature */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informations de la candidature</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                  <p className="font-medium text-lg">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fonction</p>
                  <p className="font-medium">{application.professional_profile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Montant à payer</p>
                  <p className="font-medium text-lg">250 USD/mois</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {getStatusBadge(application)}
                {application.payment_link && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                    Lien de paiement envoyé au client
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Planning des séances - Format calendrier */}
          <div className="space-y-6">
            {/* Séances intensives */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Séances intensives ({sessions.length} séances)
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Nouveau créneau
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session, index) => {
                  const statusInfo = getSessionStatusAndColor(session, allSessions);
                  const IconComponent = statusInfo.icon;
                  return (
                    <Card key={index} className={`p-4 border-2 transition-all hover:shadow-md ${statusInfo.color}`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="font-semibold">Séance {session.session_number}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {statusInfo.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{session.topic}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Date:</span>
                              <span>{session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Début:</span>
                              <span>{session.start_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Fin:</span>
                              <span>{session.end_time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant={session.completed ? "default" : "outline"}
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => updateSessionStatus(index, !session.completed)}
                          >
                            {session.completed ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Terminée
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Marquer terminée
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Suivi post-coaching */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Suivi post-coaching ({followUpSessions.length} semaines)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followUpSessions.map((session, index) => {
                  const statusInfo = getSessionStatusAndColor(session, allSessions);
                  const IconComponent = statusInfo.icon;
                  return (
                    <Card key={index} className={`p-4 border-2 transition-all hover:shadow-md ${statusInfo.color}`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="font-semibold">Semaine {session.session_number}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {statusInfo.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-medium text-sm">{session.topic}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Date:</span>
                              <span>{session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Début:</span>
                              <span>{session.start_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Fin:</span>
                              <span>{session.end_time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant={session.completed ? "default" : "outline"}
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => updateSessionStatus(index, !session.completed, true)}
                          >
                            {session.completed ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Terminée
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Marquer terminée
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
