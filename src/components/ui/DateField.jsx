import clsx from 'clsx';
import calendarIcon from '../../assets/icons/calendar.svg';

export function DateField({ label, className, ...props }) {
  return (
    <label className={clsx('flex w-full flex-col items-start gap-1', className)}>
      <span className="text-base text-ink">{label}</span>
      <span className="relative flex w-full items-center gap-1 rounded-xl bg-surface-muted p-3">
        <input
          type="date"
          className="w-full min-w-0 bg-transparent text-base text-ink focus:outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
          {...props}
        />
        <img src={calendarIcon} alt="" className="pointer-events-none h-[18px] w-[15px] shrink-0" />
      </span>
    </label>
  );
}
