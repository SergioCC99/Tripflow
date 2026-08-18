import clsx from 'clsx';
import { TextField } from '../ui/TextField';
import { DateField } from '../ui/DateField';
import { InfoAlert } from '../ui/InfoAlert';
import { CATEGORIES } from '../../features/expenses/categories';
import { PAYMENT_METHODS } from '../../features/expenses/paymentMethods';
import { CURRENCIES } from '../../features/trips/currencies';
import { formatCurrencyCOP } from '../../lib/format';
import dollarIcon from '../../assets/icons/dollar.svg';

export function ExpenseFormFields({
  trip,
  description,
  onDescriptionChange,
  currency,
  onCurrencyChange,
  amountInput,
  onAmountChange,
  onAmountBlur,
  isForeignCurrency,
  rawAmount,
  rateStatus,
  convertedAmount,
  categoryId,
  onCategoryChange,
  paymentMethodId,
  onPaymentMethodChange,
  date,
  onDateChange,
}) {
  const showConversionAlert = isForeignCurrency && (rateStatus !== 'idle' || rawAmount > 0);

  return (
    <>
      <TextField
        label="Descripción"
        placeholder="Ej: Cena con amigos"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
      />

      <div className="flex w-full flex-col gap-1">
        <span className="text-base text-ink">Monto</span>
        <div className="flex w-full items-center gap-2">
          <select
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value)}
            className="w-16 shrink-0 appearance-none rounded-xl border-none bg-surface-muted py-3 text-center text-base text-ink focus:outline-none"
          >
            {CURRENCIES.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code}
              </option>
            ))}
          </select>
          <TextField
            icon={dollarIcon}
            inputMode="numeric"
            placeholder="0"
            value={amountInput}
            onChange={(event) => onAmountChange(event.target.value)}
            onBlur={onAmountBlur}
            className="flex-1"
          />
        </div>
      </div>

      {showConversionAlert && (
        <InfoAlert>
          {rateStatus === 'loading' && 'Consultando tasa de cambio…'}
          {rateStatus === 'error' && 'No se pudo consultar la tasa de cambio. Sal del campo para reintentar.'}
          {rateStatus === 'idle' && (
            <>
              En {trip.currency} es: <strong className="font-bold">{formatCurrencyCOP(convertedAmount)}</strong>
            </>
          )}
        </InfoAlert>
      )}

      <div className="flex w-full flex-col gap-1">
        <span className="text-base text-ink">Categoría</span>
        <div className="grid w-full grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={clsx(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-3',
                categoryId === category.id ? 'bg-brand text-ink' : 'bg-surface-muted text-ink',
              )}
            >
              <span className="text-xl">{category.emoji}</span>
              <span className="text-xs">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-1">
        <span className="text-base text-ink">Método de pago</span>
        <div className="grid w-full grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => onPaymentMethodChange(method.id)}
              className={clsx(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl p-3',
                paymentMethodId === method.id ? 'bg-brand text-ink' : 'bg-surface-muted text-ink',
              )}
            >
              <span className="text-xl">{method.emoji}</span>
              <span className="text-xs">{method.label}</span>
            </button>
          ))}
        </div>
      </div>

      <DateField
        label="Fecha"
        value={date}
        min={trip.startDate}
        max={trip.endDate}
        onChange={(event) => onDateChange(event.target.value)}
      />
    </>
  );
}
