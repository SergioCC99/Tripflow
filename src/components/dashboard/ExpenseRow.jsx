import { getCategory } from '../../features/expenses/categories';
import { getPaymentMethod } from '../../features/expenses/paymentMethods';
import { getCurrency } from '../../features/trips/currencies';
import { formatCurrencyCOP } from '../../lib/format';
import dotIcon from '../../assets/icons/dot.svg';

const originalAmountFormatter = new Intl.NumberFormat('es-CO');

export function ExpenseRow({ expense }) {
  const category = getCategory(expense.categoryId);
  const method = getPaymentMethod(expense.paymentMethodId);
  const originalCurrency = expense.originalCurrency ? getCurrency(expense.originalCurrency) : null;

  return (
    <div className="flex w-full items-center gap-3 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-xl">
        {category.emoji}
      </div>

      <div className="flex min-w-0 flex-[277_0_0] flex-col items-start">
        <p className="w-full truncate text-base text-ink">{expense.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{category.label}</span>
          <img src={dotIcon} alt="" className="size-1" />
          <span className="text-xs text-muted">{method.label}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end whitespace-nowrap">
        <span className="text-base text-ink">{formatCurrencyCOP(expense.amount)}</span>
        {originalCurrency && (
          <span className="text-xs text-muted">
            {originalCurrency.name} {originalCurrency.symbol}
            {originalAmountFormatter.format(expense.originalAmount)}
          </span>
        )}
      </div>
    </div>
  );
}
