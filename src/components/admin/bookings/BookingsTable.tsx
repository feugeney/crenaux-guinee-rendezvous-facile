
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Booking {
  id: string;
  customer_name?: string;
  email?: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  message?: string;
  is_priority: boolean;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export const BookingsTable = ({ bookings }: BookingsTableProps) => {
  const getTypeBadge = (isPriority: boolean) => {
    if (isPriority) {
      return <Badge className="bg-red-100 text-red-800">Express</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des rendez-vous à venir</CardTitle>
        <CardDescription>
          {bookings.length} rendez-vous trouvé(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Date & Heure</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{booking.customer_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      {booking.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getTypeBadge(booking.is_priority)}
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium">{booking.topic}</p>
                    {booking.message && (
                      <p className="text-sm text-gray-500 truncate">{booking.message}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {format(new Date(booking.date), 'PPP', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {booking.start_time} - {booking.end_time}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
