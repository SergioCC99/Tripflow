import { useMemo, useState } from 'react';
import { loadTrips, saveTrips } from './tripsStorage';
import { seedTrips } from './seedTrips';

function readInitialTrips() {
  const stored = loadTrips();
  if (stored.length > 0) return stored;

  saveTrips(seedTrips);
  return seedTrips;
}

export function useTrips() {
  const [trips, setTrips] = useState(readInitialTrips);

  const addTrip = (trip) => {
    setTrips((prev) => {
      const next = [...prev, trip];
      saveTrips(next);
      return next;
    });
  };

  const tripsByStatus = useMemo(() => {
    return (status) => trips.filter((trip) => trip.status === status);
  }, [trips]);

  return { trips, addTrip, tripsByStatus };
}
