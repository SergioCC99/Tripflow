import type { Trip } from '../../features/trips/types';
import { TripCard } from './TripCard';

interface TripGridProps {
  trips: Trip[];
  emptyMessage: string;
}

export function TripGrid({ trips, emptyMessage }: TripGridProps) {
  if (trips.length === 0) {
    return <p className="w-full py-8 text-center text-sm text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
