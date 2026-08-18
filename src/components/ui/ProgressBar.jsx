import clsx from 'clsx';
import { getBudgetStatus } from '../../features/trips/budgetStatus';
import { useMountedAfterFrame } from '../../lib/useMountedAfterFrame';

const BAR_COLOR_BY_STATUS = {
  default: 'bg-brand',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function ProgressBar({ value, max, trackClassName = 'bg-surface' }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const status = getBudgetStatus(value, max);
  const mounted = useMountedAfterFrame();

  return (
    <div
      className={clsx('h-[10px] w-full overflow-hidden rounded-lg', trackClassName)}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx('h-full rounded-lg transition-[width] duration-700 ease-out', BAR_COLOR_BY_STATUS[status])}
        style={{ width: mounted ? `${percent}%` : '0%' }}
      />
    </div>
  );
}
