import { createContext, useContext, useMemo, useState } from 'react';
import { loadTrips, saveTrips } from './tripsStorage';
import { seedTrips } from './seedTrips';

const TripsContext = createContext(null);

function readInitialTrips() {
  const stored = loadTrips();
  if (stored.length > 0) return stored;

  saveTrips(seedTrips);
  return seedTrips;
}

export function TripsProvider({ children }) {
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

  const value = useMemo(() => ({ trips, addTrip, tripsByStatus }), [trips, tripsByStatus]);

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripsProvider');
  }
  return context;
}
