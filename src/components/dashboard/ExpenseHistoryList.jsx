import { ExpenseRow } from './ExpenseRow';
import { formatCurrencyCOP, formatShortDate } from '../../lib/format';

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function dayLabel(dateIso, todayIso, yesterdayIso) {
  if (dateIso === todayIso) return 'Hoy';
  if (dateIso === yesterdayIso) return 'Ayer';
  return formatShortDate(dateIso);
}

export function ExpenseHistoryList({ expenses, onSelectExpense }) {
  const todayIso = toISODate(new Date());
  const yesterdayIso = toISODate(new Date(Date.now() - 86_400_000));

  const groups = new Map();
  for (const expense of expenses) {
    if (!groups.has(expense.date)) groups.set(expense.date, []);
    groups.get(expense.date).push(expense);
  }

  const sortedDates = [...groups.keys()].sort((a, b) => (a < b ? 1 : -1));

  if (sortedDates.length === 0) {
    return <p className="w-full py-6 text-center text-sm text-muted">Aún no has registrado gastos.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {sortedDates.map((dateIso) => {
        const dayExpenses = groups.get(dateIso);
        const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        return (
          <div key={dateIso} className="flex w-full flex-col items-start">
            <div className="flex w-full items-center justify-center gap-2.5">
              <span className="text-base text-muted">{dayLabel(dateIso, todayIso, yesterdayIso)}</span>
              <div className="h-px flex-1 bg-divider" />
              <span className="text-base text-muted">{formatCurrencyCOP(dayTotal)}</span>
            </div>

            {dayExpenses.map((expense) => (
              <ExpenseRow key={expense.id} expense={expense} onSelect={onSelectExpense} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
