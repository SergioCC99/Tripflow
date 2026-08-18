import { getCategory } from '../../features/expenses/categories';
import { getPaymentMethod } from '../../features/expenses/paymentMethods';
import { formatCurrencyCOP } from '../../lib/format';

export function ExpenseSummaryCard({ expense }) {
  if (!expense) return null;

  const category = getCategory(expense.categoryId);
  const method = getPaymentMethod(expense.paymentMethodId);

  return (
    <div className="flex w-full items-center gap-3 rounded-2xl bg-surface-muted p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-xl">
        {category.emoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <p className="w-full truncate text-left text-base text-ink">{expense.description}</p>
        <span className="text-xs text-muted">
          {category.label} • {method.label}
        </span>
      </div>
      <span className="shrink-0 text-base font-bold text-ink">{formatCurrencyCOP(expense.amount)}</span>
    </div>
  );
}
