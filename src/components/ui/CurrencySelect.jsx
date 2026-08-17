import clsx from 'clsx';
import { CURRENCIES } from '../../features/trips/currencies';
import dollarIcon from '../../assets/icons/dollar.svg';
import chevronDownIcon from '../../assets/icons/chevron-down.svg';

export function CurrencySelect({ label = 'Moneda', className, ...props }) {
  return (
    <label className={clsx('flex w-full flex-col items-start gap-1', className)}>
      <span className="text-base text-ink">{label}</span>
      <span className="flex w-full items-center gap-1 rounded-xl bg-surface-muted p-3">
        <img src={dollarIcon} alt="" className="h-[18px] w-auto shrink-0" />
        <select
          className="w-full min-w-0 flex-1 appearance-none bg-transparent text-base text-ink focus:outline-none"
          {...props}
        >
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.label}
            </option>
          ))}
        </select>
        <img src={chevronDownIcon} alt="" className="pointer-events-none h-[6px] w-[11px] shrink-0" />
      </span>
    </label>
  );
}
