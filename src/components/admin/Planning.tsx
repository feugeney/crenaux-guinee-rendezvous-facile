
import React from 'react';
import { SessionTracking } from './SessionTracking';

export const Planning = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning</h1>
          <p className="text-muted-foreground">
            Suivi et planification des séances approuvées
          </p>
        </div>
      </div>

      <SessionTracking />
    </div>
  );
};
