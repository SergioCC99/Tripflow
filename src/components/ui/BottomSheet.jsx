import { useEffect } from 'react';

export function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:bg-ink/40 lg:p-6">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 hidden lg:block" />

      <div
        className="relative flex h-full w-full flex-col justify-end bg-ink/40 lg:h-auto lg:w-auto lg:justify-center lg:bg-transparent"
        onClick={onClose}
      >
        <div
          className="flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto rounded-t-3xl bg-surface p-6 lg:max-h-[640px] lg:w-[420px] lg:rounded-2xl lg:shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            {title && <h2 className="text-xl font-bold text-ink">{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
