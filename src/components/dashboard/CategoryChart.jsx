import { CATEGORIES } from '../../features/expenses/categories';
import { formatCompactAmount } from '../../lib/format';
import { useMountedAfterFrame } from '../../lib/useMountedAfterFrame';

export function CategoryChart({ expenses }) {
  const mounted = useMountedAfterFrame();
  const totals = CATEGORIES.map((category) => ({
    category,
    amount: expenses
      .filter((expense) => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

  const maxAmount = Math.max(1, ...totals.map((total) => total.amount));

  return (
    <div className="flex h-[240px] min-h-[200px] w-full items-end justify-center gap-3">
      {totals.map(({ category, amount }) => {
        const heightPercent = mounted ? Math.max(22, (amount / maxAmount) * 100) : 0;

        return (
          <div key={category.id} className="flex h-full min-w-[60px] flex-1 flex-col justify-end">
            <div
              className="flex w-full flex-col items-center justify-end gap-1 rounded-xl bg-brand px-1 py-2 transition-[height] duration-700 ease-out"
              style={{ height: `${heightPercent}%` }}
            >
              <span className="text-xl">{category.emoji}</span>
              <span className="text-xs font-bold text-ink">{formatCompactAmount(amount)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
