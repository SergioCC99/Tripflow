import clsx from 'clsx';

export function ProgressBar({ value, max, trackClassName = 'bg-surface' }) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className={clsx('h-[10px] w-full overflow-hidden rounded-lg', trackClassName)}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-lg bg-brand" style={{ width: `${percent}%` }} />
    </div>
  );
}
