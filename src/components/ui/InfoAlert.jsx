import clsx from 'clsx';
import infoCircleIcon from '../../assets/icons/info-circle.svg';

const VARIANT_CLASSES = {
  ok: 'border-ink bg-alert-bg',
  warning: 'border-warning bg-warning-bg',
  danger: 'border-danger bg-danger-bg',
};

const COUNTDOWN_BAR_CLASSES = {
  ok: 'bg-brand-dark',
  warning: 'bg-warning-dark',
  danger: 'bg-danger-dark',
};

export function InfoAlert({ children, className, variant = 'ok', onDismiss, durationMs }) {
  return (
    <div className={clsx('flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border', VARIANT_CLASSES[variant], className)}>
      <div className="flex w-full items-center gap-4 px-4 py-3">
        <img src={infoCircleIcon} alt="" className="size-6 shrink-0" />
        <p className="flex-1 text-sm text-ink">{children}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar alerta"
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-base text-ink transition-colors hover:bg-black/10"
          >
            ✕
          </button>
        )}
      </div>

      {durationMs && (
        <div className="h-1 w-full bg-black/10">
          <div
            className={clsx('h-full', COUNTDOWN_BAR_CLASSES[variant])}
            style={{ animation: `alert-countdown ${durationMs}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
}
