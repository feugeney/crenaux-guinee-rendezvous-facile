
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planning des séances - {application.full_name}</DialogTitle>
          <DialogDescription>
            Gérez et suivez l'évolution des séances 
            <span className="ml-2 text-xs">
              🔴 Passées | 🟠 Aujourd'hui | 🔵 Prochaine | ⚪ Programmées | ✅ Terminées
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations candidat */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Candidat</p>
                  <p className="font-medium">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profil</p>
                  <p className="font-medium">{application.professional_profile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progression</p>
                  <p className="font-medium">{getCompletionPercentage(application)}% terminé</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  {getStatusBadge(application)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planning des séances - Format calendrier */}
          <div className="space-y-6">
            {/* Séances intensives */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Séances intensives ({sessions.length} séances)
              </h3>
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
                        
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{session.topic}</p>
                          <div className="text-xs text-gray-600">
                            📅 {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'}
                          </div>
                          <div className="text-xs text-gray-600">
                            ⏰ {session.start_time} - {session.end_time}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant={session.completed ? "default" : "outline"}
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => updateSessionStatus(index, !session.completed)}
                          >
                            {session.completed ? '✅ Terminée' : '⏸️ Marquer terminée'}
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
                        
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{session.topic}</p>
                          <div className="text-xs text-gray-600">
                            📅 {session.date ? format(new Date(session.date), 'PPP', { locale: fr }) : 'Date non définie'}
                          </div>
                          <div className="text-xs text-gray-600">
                            ⏰ {session.start_time} - {session.end_time}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            variant={session.completed ? "default" : "outline"}
                            size="sm"
                            className="flex-1 text-xs h-8"
                            onClick={() => updateSessionStatus(index, !session.completed, true)}
                          >
                            {session.completed ? '✅ Terminée' : '⏸️ Marquer terminée'}
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
