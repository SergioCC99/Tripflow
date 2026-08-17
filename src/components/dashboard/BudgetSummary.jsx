import { formatCurrencyCOP } from '../../lib/format';
import { ProgressBar } from '../ui/ProgressBar';

export function BudgetSummary({ trip, spentAmount }) {
  const available = trip.totalBudget - spentAmount;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-1">
        <span className="text-sm text-muted lg:text-base">Disponible</span>
        <span className="text-[32px] font-bold text-ink">{formatCurrencyCOP(available)}</span>
        <span className="text-sm text-muted lg:text-base">De {formatCurrencyCOP(trip.totalBudget)} de presupuesto</span>
      </div>

      <ProgressBar value={spentAmount} max={trip.totalBudget} trackClassName="bg-surface-muted" />

      <div className="flex w-full items-center justify-between text-sm text-muted lg:text-base">
        <span>{formatCurrencyCOP(spentAmount)} Gastado</span>
        <span>{formatCurrencyCOP(trip.totalBudget)}</span>
      </div>
    </div>
  );
}
