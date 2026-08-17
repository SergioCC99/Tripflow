import { Link } from 'react-router-dom';
import { countTripDays, formatCurrencyCOP, formatShortDate } from '../../lib/format';
import { ProgressBar } from '../ui/ProgressBar';
import dividerIcon from '../../assets/icons/divider.svg';
import dotIcon from '../../assets/icons/dot.svg';

export function TripCard({ trip }) {
  const days = countTripDays(trip.startDate, trip.endDate);

  return (
    <Link
      to={`/viajes/${trip.id}`}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-secondary"
    >
      <div
        className="relative flex min-h-[120px] items-end bg-cover bg-center px-4 py-3"
        style={{ backgroundImage: `url(${trip.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/64" />
        <p className="relative text-2xl font-bold text-inverse">{trip.destination}</p>
      </div>

      <div className="flex flex-col gap-3 bg-surface-muted px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">{formatShortDate(trip.startDate)}</span>
            <img src={dividerIcon} alt="" className="h-px w-2" />
            <span className="text-xs text-muted">{formatShortDate(trip.endDate)}</span>
          </div>
          <img src={dotIcon} alt="" className="size-1" />
          <span className="text-xs text-muted">{days} días</span>
        </div>

        <div className="flex w-full flex-col gap-1">
          <span className="text-xs text-muted">Gastado</span>
          <span className="text-2xl font-bold text-ink">{formatCurrencyCOP(trip.spentAmount)}</span>
          <span className="text-xs text-muted">De {formatCurrencyCOP(trip.totalBudget)}</span>
        </div>

        <ProgressBar value={trip.spentAmount} max={trip.totalBudget} />
      </div>
    </Link>
  );
}
