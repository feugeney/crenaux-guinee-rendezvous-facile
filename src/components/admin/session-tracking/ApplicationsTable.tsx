
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Calendar, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaidApplication } from './types';

interface ApplicationsTableProps {
  applications: PaidApplication[];
  getCompletionPercentage: (application: PaidApplication) => number;
  getStatusBadge: (application: PaidApplication) => React.ReactElement;
  onViewSessions: (application: PaidApplication) => void;
}

export const ApplicationsTable = ({ 
  applications, 
  getCompletionPercentage, 
  getStatusBadge, 
  onViewSessions 
}: ApplicationsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidatures en suivi</CardTitle>
        <CardDescription>
          {applications.length} candidature(s) avec planning validé
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Aucune candidature avec planning validé</p>
            <p className="text-sm">Les candidatures apparaîtront ici après validation du planning</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Profil</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => {
                const completionPercentage = getCompletionPercentage(application);
                return (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{application.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {application.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {application.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.professional_profile}</p>
                        <p className="text-sm text-gray-500">{application.city_country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(application.created_at), 'PPP', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{completionPercentage}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSessions(application)}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Voir Planning
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
