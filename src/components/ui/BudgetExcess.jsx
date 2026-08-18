import { formatCurrencyCOP } from '../../lib/format';

export function BudgetExcess({ amount }) {
  return (
    <span className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs">
      <span className="font-bold text-danger">+{formatCurrencyCOP(amount)}</span>
      <span className="text-muted">Excedido</span>
    </span>
  );
}
