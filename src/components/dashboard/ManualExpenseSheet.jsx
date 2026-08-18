import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { ExpenseFormFields } from './ExpenseFormFields';
import { ConfirmationCard } from '../ui/ConfirmationCard';
import { ExpenseSummaryCard } from './ExpenseSummaryCard';
import { DEFAULT_CATEGORY_ID } from '../../features/expenses/categories';
import { DEFAULT_PAYMENT_METHOD_ID } from '../../features/expenses/paymentMethods';
import { useExpenses } from '../../features/expenses/ExpensesProvider';
import { fetchExchangeRate } from '../../features/expenses/exchangeRate';
import { formatThousands, parseThousands } from '../../lib/format';
import checkIcon from '../../assets/icons/check.svg';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function ManualExpenseSheet({ trip, open, onClose }) {
  const { addExpense } = useExpenses();
  const [submitted, setSubmitted] = useState(false);
  const [submittedExpense, setSubmittedExpense] = useState(null);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [currency, setCurrency] = useState(trip.currency);
  const [amountInput, setAmountInput] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rateStatus, setRateStatus] = useState('idle');
  const [date, setDate] = useState(todayIso());

  useEffect(() => {
    if (!open) return undefined;

    setSubmitted(false);
    setDescription('');
    setCategoryId(null);
    setPaymentMethodId(null);
    setCurrency(trip.currency);
    setAmountInput('');
    setConvertedAmount(0);
    setRateStatus('idle');
    setDate(todayIso());

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, trip.currency]);

  const isForeignCurrency = currency !== trip.currency;
  const rawAmount = parseThousands(amountInput);

  useEffect(() => {
    if (!isForeignCurrency) {
      setConvertedAmount(rawAmount);
    }
    // Al cambiar de moneda, si ya hay un monto escrito, se consulta la tasa de una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, isForeignCurrency]);

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

  const canSubmit = isForeignCurrency ? convertedAmount > 0 : rawAmount > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const expense = {
      id: crypto.randomUUID(),
      tripId: trip.id,
      description: description.trim() || 'Gasto',
      categoryId: categoryId ?? DEFAULT_CATEGORY_ID,
      paymentMethodId: paymentMethodId ?? DEFAULT_PAYMENT_METHOD_ID,
      amount: isForeignCurrency ? convertedAmount : rawAmount,
      currency: trip.currency,
      ...(isForeignCurrency ? { originalAmount: rawAmount, originalCurrency: currency } : {}),
      date,
      createdAt: Date.now(),
    };

    addExpense(expense);
    setSubmittedExpense(expense);
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:bg-ink/40 lg:p-6">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 hidden lg:block" />

      <div
        className="relative flex h-full w-full flex-col justify-end bg-ink/40 lg:h-auto lg:w-auto lg:justify-center lg:bg-transparent"
        onClick={onClose}
      >
        <div
          className={clsx(
            'animate-slide-up-in flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface lg:h-auto lg:max-h-[640px] lg:rounded-2xl lg:shadow-xl',
            !submitted && 'lg:w-[685px]',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {submitted ? (
            <ConfirmationCard
              icon={checkIcon}
              iconClassName="h-[27px] w-[38px]"
              circleClassName="bg-brand"
              title="¡Gasto registrado con éxito!"
              description="Tu gasto se ha añadido correctamente a tu viaje."
              onContinue={onClose}
            >
              <ExpenseSummaryCard expense={submittedExpense} />
            </ConfirmationCard>
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
                <div className="flex w-full flex-col gap-1">
                  <span className="text-sm text-muted">Nuevo gasto</span>
                  <h1 className="text-2xl font-bold text-ink">Registro manual</h1>
                </div>

                <ExpenseFormFields
                  trip={trip}
                  description={description}
                  onDescriptionChange={setDescription}
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  amountInput={amountInput}
                  onAmountChange={(value) => setAmountInput(formatThousands(value))}
                  onAmountBlur={refreshRate}
                  isForeignCurrency={isForeignCurrency}
                  rawAmount={rawAmount}
                  rateStatus={rateStatus}
                  convertedAmount={convertedAmount}
                  categoryId={categoryId}
                  onCategoryChange={setCategoryId}
                  paymentMethodId={paymentMethodId}
                  onPaymentMethodChange={setPaymentMethodId}
                  date={date}
                  onDateChange={setDate}
                />
              </div>

              <div className="flex shrink-0 items-center gap-4 border-t border-divider bg-surface p-4">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={!canSubmit} className="flex-1">
                  Guardar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
