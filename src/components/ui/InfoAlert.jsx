import clsx from 'clsx';
import infoCircleIcon from '../../assets/icons/info-circle.svg';

export function InfoAlert({ children, className }) {
  return (
    <div
      className={clsx(
        'flex w-full items-center gap-4 rounded-2xl border border-ink bg-alert-bg px-4 py-3',
        className,
      )}
    >
      <img src={infoCircleIcon} alt="" className="size-6 shrink-0" />
      <p className="flex-1 text-sm text-ink">{children}</p>
    </div>
  );
}
