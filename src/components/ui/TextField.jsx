import clsx from 'clsx';

export function TextField({ label, icon, className, ...props }) {
  return (
    <label className={clsx('flex w-full flex-col items-start gap-1', className)}>
      {label && <span className="text-base text-ink">{label}</span>}
      <span className="flex w-full items-center gap-1 rounded-xl bg-surface-muted p-3">
        {icon && <img src={icon} alt="" className="h-[18px] w-auto shrink-0" />}
        <input
          className="w-full min-w-0 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
          {...props}
        />
      </span>
    </label>
  );
}
