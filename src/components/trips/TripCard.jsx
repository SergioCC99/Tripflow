import { Link } from 'react-router-dom';
import { countTripDays, formatCurrencyCOP, formatShortDate } from '../../lib/format';
import { useExpenses } from '../../features/expenses/ExpensesProvider';
import { getBudgetStatus } from '../../features/trips/budgetStatus';
import { ProgressBar } from '../ui/ProgressBar';
import { BudgetExcess } from '../ui/BudgetExcess';
import dotIcon from '../../assets/icons/dot.svg';

export function TripCard({ trip }) {
  const days = countTripDays(trip.startDate, trip.endDate);
  const { getTripSpent } = useExpenses();
  const spentAmount = getTripSpent(trip.id);
  const isDanger = getBudgetStatus(spentAmount, trip.totalBudget) === 'danger';
  const excessAmount = Math.max(0, spentAmount - trip.totalBudget);

  return (
    <Link
      to={`/viajes/${trip.id}`}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-secondary"
    >
      <div
        className="relative flex min-h-[120px] items-end bg-brand bg-cover bg-center px-4 py-3"
        style={trip.imageUrl ? { backgroundImage: `url(${trip.imageUrl})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/64" />
        <p className="relative text-2xl font-bold text-inverse">{trip.destination}</p>
      </div>

      <div className="flex flex-col gap-3 bg-surface-muted px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">{formatShortDate(trip.startDate)}</span>
            <span className="h-px w-2 bg-muted" />
            <span className="text-xs text-muted">{formatShortDate(trip.endDate)}</span>
          </div>
          <img src={dotIcon} alt="" className="size-1" />
          <span className="text-xs text-muted">{days} días</span>
        </div>

        <div className="flex w-full flex-col gap-1">
          <span className="text-xs text-muted">Gastado</span>
          <span className="text-2xl font-bold text-ink">{formatCurrencyCOP(spentAmount)}</span>
          <div className="flex w-full items-end justify-between">
            <span className="text-xs text-muted">De {formatCurrencyCOP(trip.totalBudget)}</span>
            {isDanger && <BudgetExcess amount={excessAmount} />}
          </div>
        </div>

        <ProgressBar value={spentAmount} max={trip.totalBudget} />
      </div>
    </Link>
  );
}
