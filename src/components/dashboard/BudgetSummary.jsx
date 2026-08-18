import { formatCurrencyCOP } from '../../lib/format';
import { getBudgetStatus } from '../../features/trips/budgetStatus';
import { ProgressBar } from '../ui/ProgressBar';
import { BudgetExcess } from '../ui/BudgetExcess';

export function BudgetSummary({ trip, spentAmount }) {
  const available = trip.totalBudget - spentAmount;
  const isDanger = getBudgetStatus(spentAmount, trip.totalBudget) === 'danger';
  const excessAmount = Math.max(0, spentAmount - trip.totalBudget);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-1">
        <span className="text-sm text-muted lg:text-base">Disponible</span>
        <span className="text-[32px] font-bold text-ink">{formatCurrencyCOP(available)}</span>
        <div className="flex w-full items-end justify-between">
          <span className="text-sm text-muted lg:text-base">De {formatCurrencyCOP(trip.totalBudget)} de presupuesto</span>
          {isDanger && <BudgetExcess amount={excessAmount} />}
        </div>
      </div>

      <ProgressBar value={spentAmount} max={trip.totalBudget} trackClassName="bg-surface-muted" />

      <div className="flex w-full items-center justify-between text-sm text-muted lg:text-base">
        <span>{formatCurrencyCOP(spentAmount)} Gastado</span>
        <span>{formatCurrencyCOP(trip.totalBudget)}</span>
      </div>
    </div>
  );
}
