import { useState } from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { ManualExpenseSheet } from './ManualExpenseSheet';
import { ExpenseConfirmationModal } from './ExpenseConfirmationModal';
import { classifyExpenseText } from '../../features/expenses/classifyExpenseText';
import { useSpeechToText } from '../../features/expenses/useSpeechToText';
import { useExpenses } from '../../features/expenses/ExpensesProvider';
import sparklesIcon from '../../assets/icons/sparkles.svg';
import micIcon from '../../assets/icons/mic.svg';
import plusIcon from '../../assets/icons/plus.svg';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function AddExpenseBar({ trip }) {
  const { addExpense } = useExpenses();
  const [text, setText] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const { isSupported: micSupported, isListening, start, stop } = useSpeechToText({
    lang: 'es-CO',
    onResult: (transcript) => setText(transcript),
  });

  const submitText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { amount, categoryId, paymentMethodId, description } = classifyExpenseText(trimmed);
    if (amount <= 0) return;

    addExpense({
      id: crypto.randomUUID(),
      tripId: trip.id,
      description,
      categoryId,
      paymentMethodId,
      amount,
      currency: trip.currency,
      date: todayIso(),
      createdAt: Date.now(),
    });
    setText('');
    setConfirmationOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitText();
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-secondary bg-surface-muted px-4 pt-4 pb-8 lg:px-[181px]">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-2">
          <div className="flex flex-1 items-center gap-1 rounded-full border border-ink-secondary bg-surface-muted px-3 py-2">
            <img src={sparklesIcon} alt="" className="h-[14px] w-[15px] shrink-0" />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ej: "Cena amigos 18.000 pesos"'
              className="w-full min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={isListening ? stop : start}
              disabled={!micSupported}
              aria-label={isListening ? 'Detener grabación' : 'Registrar gasto por voz'}
              className="flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <img src={micIcon} alt="" className={clsx('h-[16px] w-[12px]', isListening && 'animate-pulse')} />
            </button>
          </div>

          <Button
            icon={<img src={plusIcon} alt="" className="size-[14px]" />}
            onClick={() => setManualOpen(true)}
            aria-label="Registrar gasto manualmente"
          />
        </div>
      </div>

      <ManualExpenseSheet trip={trip} open={manualOpen} onClose={() => setManualOpen(false)} />
      <ExpenseConfirmationModal open={confirmationOpen} onClose={() => setConfirmationOpen(false)} />
    </>
  );
}
