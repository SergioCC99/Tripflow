import clsx from 'clsx';
import { formatCompactAmount, formatShortDate, toISODate, todayIso as getTodayIso } from '../../lib/format';
import { useMountedAfterFrame } from '../../lib/useMountedAfterFrame';

const MIN_HEIGHT_PERCENT = 22;

function buildDayRange(startIso, endIso) {
  const days = [];
  let cursor = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);

  while (cursor <= end) {
    days.push(toISODate(cursor));
    cursor = new Date(cursor.getTime() + 86_400_000);
  }

  return days;
}

export function DayChart({ trip, expenses }) {
  const mounted = useMountedAfterFrame();
  const days = buildDayRange(trip.startDate, trip.endDate);
  const todayIso = getTodayIso();
  const dailyBudget = trip.totalBudget / days.length;

  const dayTotals = days.map((day) => {
    const hasPassed = day <= todayIso;
    const amount = hasPassed
      ? expenses.filter((expense) => expense.date === day).reduce((sum, expense) => sum + expense.amount, 0)
      : null;
    return { day, amount, hasPassed };
  });

  const maxAmount = Math.max(1, ...dayTotals.map((total) => total.amount ?? 0));
  const referencePercent = Math.min(100, (dailyBudget / maxAmount) * 100);

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative flex h-[240px] min-w-max items-end gap-3">
        <div
          className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-ink"
          style={{ bottom: `${referencePercent}%` }}
        />

        {dayTotals.map(({ day, amount, hasPassed }) => {
          const targetHeightPercent = hasPassed
            ? Math.max(MIN_HEIGHT_PERCENT, (amount / maxAmount) * 100)
            : MIN_HEIGHT_PERCENT;
          const heightPercent = mounted ? targetHeightPercent : 0;
          const isOverBudget = hasPassed && amount > dailyBudget;

          return (
            <div key={day} className="flex h-full w-[43px] shrink-0 flex-col justify-end">
              <div
                className={clsx(
                  'flex w-full flex-col items-center justify-end gap-1 rounded-xl px-1 py-2 transition-[height] duration-700 ease-out',
                  hasPassed && (isOverBudget ? 'bg-warning' : 'bg-brand'),
                )}
                style={{ height: `${heightPercent}%` }}
              >
                <span className="text-xs font-bold text-ink">{hasPassed ? formatCompactAmount(amount) : '0'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex min-w-max gap-3">
        {dayTotals.map(({ day }) => (
          <span key={day} className="w-[43px] shrink-0 text-center text-xs text-ink">
            {formatShortDate(day)}
          </span>
        ))}
      </div>
    </div>
  );
}
