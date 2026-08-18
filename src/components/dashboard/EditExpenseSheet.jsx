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
import trashIcon from '../../assets/icons/trash.svg';
import questionMarkIcon from '../../assets/icons/question-mark.svg';

export function EditExpenseSheet({ trip, expense, open, onClose }) {
  const { updateExpense, deleteExpense } = useExpenses();
  const [status, setStatus] = useState('form');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [currency, setCurrency] = useState(trip.currency);
  const [amountInput, setAmountInput] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rateStatus, setRateStatus] = useState('idle');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!open || !expense) return undefined;

    setStatus('form');
    setDescription(expense.description);
    setCategoryId(expense.categoryId);
    setPaymentMethodId(expense.paymentMethodId);
    setCurrency(expense.originalCurrency ?? trip.currency);
    setAmountInput(formatThousands(expense.originalAmount ?? expense.amount));
    setConvertedAmount(expense.amount);
    setRateStatus('idle');
    setDate(expense.date);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, expense, trip.currency]);

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

  const editedExpensePreview = {
    description: description.trim() || 'Gasto',
    categoryId: categoryId ?? DEFAULT_CATEGORY_ID,
    paymentMethodId: paymentMethodId ?? DEFAULT_PAYMENT_METHOD_ID,
    amount: isForeignCurrency ? convertedAmount : rawAmount,
  };

  const handleUpdate = () => {
    if (!canSubmit || !expense) return;

    updateExpense(expense.id, {
      description: description.trim() || 'Gasto',
      categoryId: categoryId ?? DEFAULT_CATEGORY_ID,
      paymentMethodId: paymentMethodId ?? DEFAULT_PAYMENT_METHOD_ID,
      amount: isForeignCurrency ? convertedAmount : rawAmount,
      currency: trip.currency,
      originalAmount: isForeignCurrency ? rawAmount : undefined,
      originalCurrency: isForeignCurrency ? currency : undefined,
      date,
    });

    setStatus('edited');
  };

  const handleDelete = () => {
    if (!expense) return;
    setStatus('confirmDelete');
  };

  const handleConfirmDelete = () => {
    if (!expense) return;
    deleteExpense(expense.id);
    setStatus('deleted');
  };

  if (!open || !expense) return null;

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
            status === 'form' && 'lg:w-[685px]',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {status === 'edited' && (
            <ConfirmationCard
              icon={checkIcon}
              iconClassName="h-[27px] w-[38px]"
              circleClassName="bg-brand"
              title="¡Gasto modificado con éxito!"
              description="Los cambios se han guardado correctamente."
              onContinue={onClose}
            >
              <ExpenseSummaryCard expense={editedExpensePreview} />
            </ConfirmationCard>
          )}

          {status === 'confirmDelete' && (
            <ConfirmationCard
              icon={questionMarkIcon}
              iconClassName="h-[26px] w-[16px]"
              circleClassName="bg-surface-muted"
              title="¿Está seguro que desea eliminarlo?"
              description="Al confirmar la acción, no se podrá recuperar la información."
              onContinue={handleConfirmDelete}
              onCancel={() => setStatus('form')}
            >
              <ExpenseSummaryCard expense={expense} />
            </ConfirmationCard>
          )}

          {status === 'deleted' && (
            <ConfirmationCard
              icon={trashIcon}
              iconClassName="h-[32px] w-[29px]"
              circleClassName="bg-danger-bg"
              title="¡Gasto eliminado!"
              description="El gasto ha sido eliminado correctamente."
              onContinue={onClose}
            >
              <ExpenseSummaryCard expense={expense} />
            </ConfirmationCard>
          )}

          {status === 'form' && (
            <>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
                <div className="flex w-full flex-col gap-1">
                  <span className="text-sm text-muted">Editar gasto</span>
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

              <div className="flex shrink-0 flex-col items-center gap-4 border-t border-divider bg-surface p-4 lg:flex-row lg:justify-between">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<img src={trashIcon} alt="" className="h-[19px] w-[17px]" />}
                  onClick={handleDelete}
                  className="order-2 lg:order-1"
                >
                  Eliminar
                </Button>

                <div className="order-1 flex w-full items-center gap-4 lg:order-2 lg:w-auto">
                  <Button variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate} disabled={!canSubmit} className="flex-1 lg:flex-none">
                    Modificar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
