
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingsFilterProps {
  filterType: string;
  setFilterType: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resetFilters: () => void;
}

export const BookingsFilter = ({
  filterType,
  setFilterType,
  searchTerm,
  setSearchTerm,
  resetFilters
}: BookingsFilterProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rendez-vous</SelectItem>
                <SelectItem value="express">Express uniquement</SelectItem>
                <SelectItem value="standard">Standard uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Input
              placeholder="Rechercher (nom, email, sujet)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
