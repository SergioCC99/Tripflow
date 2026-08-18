import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { CURRENCIES } from '../../features/trips/currencies';
import dollarIcon from '../../assets/icons/dollar.svg';
import chevronDownIcon from '../../assets/icons/chevron-down.svg';

export function CurrencySelect({ label = 'Moneda', value, onChange, className, variant = 'full' }) {
  const isCompact = variant === 'compact';
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return undefined;

    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 220) });
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const isOutside = (target) =>
      !rootRef.current?.contains(target) && !panelRef.current?.contains(target);

    const handlePointerDown = (event) => {
      if (isOutside(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const handleScroll = (event) => {
      if (isOutside(event.target)) setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const selected = CURRENCIES.find((currency) => currency.code === value) ?? CURRENCIES[0];

  const selectOption = (code) => {
    onChange({ target: { value: code } });
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={clsx('relative flex flex-col items-start gap-1', isCompact ? 'w-16 shrink-0' : 'w-full', className)}>
      {!isCompact && <span className="text-base text-ink">{label}</span>}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          'flex w-full cursor-pointer items-center gap-1 rounded-xl bg-surface-muted text-base text-ink',
          isCompact ? 'justify-center py-3' : 'p-3',
        )}
      >
        {!isCompact && <img src={dollarIcon} alt="" className="h-[18px] w-auto shrink-0" />}
        <span className={clsx('min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap', isCompact && 'text-center')}>
          {isCompact ? selected.code : selected.label}
        </span>
        {!isCompact && (
          <img
            src={chevronDownIcon}
            alt=""
            className={clsx('h-[6px] w-[11px] shrink-0 transition-transform duration-150', open && 'rotate-180')}
          />
        )}
      </button>

      {open &&
        panelStyle &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: panelStyle.top, left: panelStyle.left, width: panelStyle.width }}
            className="z-[60] max-h-[260px] overflow-y-auto rounded-xl bg-surface-muted shadow-[0px_2px_8px_rgba(0,0,0,0.25)]"
          >
            {CURRENCIES.map((currency, index) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => selectOption(currency.code)}
                className={clsx(
                  'flex w-full cursor-pointer items-center p-3 text-left text-base transition-colors',
                  index < CURRENCIES.length - 1 && 'border-b border-ink',
                  currency.code === value ? 'bg-brand text-ink' : 'text-ink hover:bg-surface',
                )}
              >
                <span className="truncate">{currency.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
