import { useEffect, useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { TextField } from '../ui/TextField';
import { DateField } from '../ui/DateField';
import { CurrencySelect } from '../ui/CurrencySelect';
import { TabGroup } from '../ui/TabGroup';
import { Button } from '../ui/Button';
import { CATEGORIES, DEFAULT_CATEGORY_ID } from '../../features/expenses/categories';
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD_ID } from '../../features/expenses/paymentMethods';
import { useExpenses } from '../../features/expenses/ExpensesProvider';
import { fetchExchangeRate } from '../../features/expenses/exchangeRate';
import { formatThousands, parseThousands } from '../../lib/format';
import dollarIcon from '../../assets/icons/dollar.svg';

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  label: `${category.emoji} ${category.label}`,
  value: category.id,
}));

const METHOD_OPTIONS = PAYMENT_METHODS.map((method) => ({ label: method.label, value: method.id }));

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function ManualExpenseSheet({ trip, open, onClose }) {
  const { addExpense } = useExpenses();
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORY_ID);
  const [paymentMethodId, setPaymentMethodId] = useState(DEFAULT_PAYMENT_METHOD_ID);
  const [currency, setCurrency] = useState(trip.currency);
  const [amountInput, setAmountInput] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rateStatus, setRateStatus] = useState('idle');
  const [date, setDate] = useState(todayIso());

  useEffect(() => {
    if (!open) return;
    setDescription('');
    setCategoryId(DEFAULT_CATEGORY_ID);
    setPaymentMethodId(DEFAULT_PAYMENT_METHOD_ID);
    setCurrency(trip.currency);
    setAmountInput('');
    setConvertedAmount(0);
    setRateStatus('idle');
    setDate(todayIso());
  }, [open, trip.currency]);

  const isForeignCurrency = currency !== trip.currency;
  const rawAmount = parseThousands(amountInput);

  useEffect(() => {
    if (!isForeignCurrency) {
      setConvertedAmount(rawAmount);
    }
    // Al cambiar de moneda, si ya hay un monto escrito, se consulta la tasa de una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, rawAmount, isForeignCurrency]);

  const refreshRate = async () => {
    if (!isForeignCurrency || rawAmount <= 0) return;
    setRateStatus('loading');
    const rate = await fetchExchangeRate(currency, trip.currency);
    if (rate === null) {
      setRateStatus('error');
      return;
    }
    setConvertedAmount(Math.round(rawAmount * rate));
    setRateStatus('idle');
  };

  const canSubmit = convertedAmount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    addExpense({
      id: crypto.randomUUID(),
      tripId: trip.id,
      description: description.trim() || 'Gasto',
      categoryId,
      paymentMethodId,
      amount: convertedAmount,
      currency: trip.currency,
      ...(isForeignCurrency ? { originalAmount: rawAmount, originalCurrency: currency } : {}),
      date,
      createdAt: Date.now(),
    });

    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Nuevo gasto">
      <div className="flex w-full flex-col gap-4">
        <TextField
          label="Descripción"
          placeholder="Ej. Cena en restaurante"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="flex w-full flex-col gap-1">
          <span className="text-base text-ink">Categoría</span>
          <TabGroup options={CATEGORY_OPTIONS} value={categoryId} onChange={setCategoryId} size="sm" />
        </div>

        <div className="flex w-full flex-col gap-1">
          <span className="text-base text-ink">Método de pago</span>
          <TabGroup options={METHOD_OPTIONS} value={paymentMethodId} onChange={setPaymentMethodId} size="sm" />
        </div>

        <CurrencySelect label="Moneda" value={currency} onChange={(event) => setCurrency(event.target.value)} />

        <TextField
          label={isForeignCurrency ? `Monto pagado en ${currency}` : 'Monto'}
          icon={dollarIcon}
          inputMode="numeric"
          placeholder="0"
          value={amountInput}
          onChange={(event) => setAmountInput(formatThousands(event.target.value))}
          onBlur={refreshRate}
        />

        {isForeignCurrency && (
          <div className="flex w-full flex-col gap-1">
            <span className="text-base text-ink">Monto en {trip.currency}</span>
            <TextField
              icon={dollarIcon}
              inputMode="numeric"
              value={convertedAmount ? formatThousands(convertedAmount) : ''}
              onChange={(event) => setConvertedAmount(parseThousands(event.target.value))}
            />
            {rateStatus === 'loading' && <span className="text-xs text-muted">Consultando tasa de cambio…</span>}
            {rateStatus === 'error' && (
              <span className="text-xs text-danger">
                No se pudo consultar la tasa de cambio. Puedes escribir el monto convertido manualmente.
              </span>
            )}
          </div>
        )}

        <DateField
          label="Fecha"
          value={date}
          min={trip.startDate}
          max={trip.endDate}
          onChange={(event) => setDate(event.target.value)}
        />

        <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full">
          Registrar gasto
        </Button>
      </div>
    </BottomSheet>
  );
}
