import { useMemo, useState } from 'react';
import type { Trip, TripStatus } from './types';
import { loadTrips, saveTrips } from './tripsStorage';
import { seedTrips } from './seedTrips';

function readInitialTrips(): Trip[] {
  const stored = loadTrips();
  if (stored.length > 0) return stored;

  saveTrips(seedTrips);
  return seedTrips;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(readInitialTrips);

  const addTrip = (trip: Trip) => {
    setTrips((prev) => {
      const next = [...prev, trip];
      saveTrips(next);
      return next;
    });
  };

  const tripsByStatus = useMemo(() => {
    return (status: TripStatus) => trips.filter((trip) => trip.status === status);
  }, [trips]);

  return { trips, addTrip, tripsByStatus };
}
