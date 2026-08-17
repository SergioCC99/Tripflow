import { TripCard } from './TripCard';

export function TripGrid({ trips, emptyMessage }) {
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
