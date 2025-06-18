
import React from 'react';
import { useBookings } from './bookings/useBookings';
import { BookingsFilter } from './bookings/BookingsFilter';
import { BookingsStats } from './bookings/BookingsStats';
import { BookingsViewTabs } from './bookings/BookingsViewTabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UpcomingBookingsProps {
  selectedDate?: string | null;
}

export const UpcomingBookings = ({ selectedDate }: UpcomingBookingsProps) => {
  const {
    bookings,
    loading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    resetFilters,
    stats,
    isDateSelected
  } = useBookings({ selectedDate });

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedDate ? `Rendez-vous du ${format(new Date(selectedDate), 'PPP', { locale: fr })}` : 'Rendez-vous à venir'}
          </h2>
          <p className="text-muted-foreground">
            {selectedDate ? 'Rendez-vous programmés pour la date sélectionnée' : 'Tous les rendez-vous validés programmés'}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <BookingsFilter 
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />

      {/* Statistiques */}
      <BookingsStats 
        totalBookings={stats.total}
        expressBookings={stats.express}
        standardBookings={stats.standard}
        isDateSelected={isDateSelected}
      />

      {/* Onglets pour vue calendrier et liste */}
      <BookingsViewTabs filteredBookings={bookings} />
    </div>
  );
};
