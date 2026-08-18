import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import { DateField } from '../ui/DateField';
import { CurrencySelect } from '../ui/CurrencySelect';
import { InfoAlert } from '../ui/InfoAlert';
import { PhotoUploadField } from '../ui/PhotoUploadField';
import { ConfirmationCard } from '../ui/ConfirmationCard';
import { useTrips } from '../../features/trips/TripsProvider';
import { useExpenses } from '../../features/expenses/ExpensesProvider';
import { deriveTripStatus } from '../../features/trips/deriveTripStatus';
import { countTripDays, formatCurrencyCOP, formatThousands, parseThousands } from '../../lib/format';
import checkIcon from '../../assets/icons/check.svg';
import trashIcon from '../../assets/icons/trash.svg';
import questionMarkIcon from '../../assets/icons/question-mark.svg';
import dollarIcon from '../../assets/icons/dollar.svg';
import defaultTripImage from '../../assets/images/Default_Img.png';

const CLOSE_ANIMATION_MS = 260;

export function EditTripSheet({ trip, open, onClose, onDeleted }) {
  const { updateTrip, deleteTrip } = useTrips();
  const { deleteExpensesByTrip } = useExpenses();
  const [status, setStatus] = useState('form');
  const [isClosing, setIsClosing] = useState(false);
  const [destination, setDestination] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('COP');
  const [budgetInput, setBudgetInput] = useState('');

  useEffect(() => {
    if (!open || !trip) return undefined;

    setStatus('form');
    setIsClosing(false);
    setDestination(trip.destination);
    setCoverPhoto(trip.imageUrl ?? '');
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setCurrency(trip.currency);
    setBudgetInput(formatThousands(trip.totalBudget));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
    // Solo se debe repoblar el formulario al abrir el sheet, no cada vez que `trip` cambia de
    // referencia (por ejemplo, justo después de guardar los propios cambios de este formulario).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trip?.id]);

  useEffect(() => {
    if (!isClosing) return undefined;
    const timer = setTimeout(onClose, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  const requestClose = () => setIsClosing(true);
  const dismiss = () => (status === 'deleted' ? onDeleted() : requestClose());

  if (!open || !trip) return null;

  const totalBudget = parseThousands(budgetInput);
  const hasValidDates = Boolean(startDate && endDate && startDate <= endDate);
  const days = hasValidDates ? countTripDays(startDate, endDate) : null;
  const dailyBudget = days ? Math.round(totalBudget / days) : 0;

  const canSubmit = destination.trim().length > 0 && hasValidDates && Boolean(currency) && totalBudget > 0;

  const handleUpdate = () => {
    if (!canSubmit) return;

    updateTrip(trip.id, {
      destination: destination.trim(),
      imageUrl: coverPhoto || defaultTripImage,
      startDate,
      endDate,
      currency,
      totalBudget,
      status: deriveTripStatus(startDate, endDate),
    });

    setStatus('edited');
  };

  const handleDelete = () => setStatus('confirmDelete');

  const handleConfirmDelete = () => {
    deleteExpensesByTrip(trip.id);
    deleteTrip(trip.id);
    setStatus('deleted');
  };

  return (
    <div className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:bg-ink/40 lg:p-6">
      <button type="button" aria-label="Cerrar" onClick={dismiss} className="absolute inset-0 hidden lg:block" />

      <div
        className="relative flex h-full w-full flex-col justify-end bg-ink/40 lg:h-auto lg:w-auto lg:justify-center lg:bg-transparent"
        onClick={dismiss}
      >
        <div
          className={clsx(
            'flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-surface lg:h-auto lg:max-h-[640px] lg:rounded-2xl lg:shadow-xl',
            status === 'form' && 'lg:w-[685px]',
            isClosing ? 'animate-slide-down-out' : 'animate-slide-up-in',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {status === 'edited' && (
            <ConfirmationCard
              icon={checkIcon}
              iconClassName="h-[27px] w-[38px]"
              circleClassName="bg-brand"
              title="¡Información modificada con éxito!"
              description="Los cambios se han guardado correctamente."
              onContinue={requestClose}
            />
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
            />
          )}

          {status === 'deleted' && (
            <ConfirmationCard
              icon={trashIcon}
              iconClassName="h-[32px] w-[29px]"
              circleClassName="bg-danger-bg"
              title="¡Viaje y presupuesto eliminado!"
              description="El viaje y su presupuesto han sido eliminados correctamente."
              onContinue={onDeleted}
            />
          )}

          {status === 'form' && (
            <>
              <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 lg:p-6">
                <div className="flex w-full flex-col gap-1">
                  <span className="text-sm text-muted">Editar viaje</span>
                  <h1 className="text-2xl font-bold text-ink">Modifica tu viaje</h1>
                </div>

                <div className="flex w-full flex-col gap-4">
                  <TextField
                    label="Destino"
                    placeholder='Ej. "Madrid" o "Viaje prom"'
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                  />
                  <PhotoUploadField value={coverPhoto} onChange={setCoverPhoto} />
                </div>

                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full gap-4">
                    <DateField
                      label="Inicio"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="flex-1"
                    />
                    <DateField
                      label="Fin"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <InfoAlert>
                    {days ? (
                      <>
                        <strong className="font-bold">{days} días de viaje. </strong>
                        Las fechas se usarán para calcular el presupuesto diario.
                      </>
                    ) : (
                      'Elige la fecha de inicio y fin de tu viaje.'
                    )}
                  </InfoAlert>
                </div>

                <div className="flex w-full flex-col gap-4">
                  <CurrencySelect value={currency} onChange={(event) => setCurrency(event.target.value)} />
                  <InfoAlert>Si registras un gasto en otra moneda, lo convertimos automáticamente.</InfoAlert>
                </div>

                <div className="flex w-full flex-col gap-4">
                  <TextField
                    label="Presupuesto total"
                    icon={dollarIcon}
                    inputMode="numeric"
                    placeholder="0"
                    value={budgetInput}
                    onChange={(event) => setBudgetInput(formatThousands(event.target.value))}
                  />
                  <InfoAlert>
                    Tu presupuesto diario:
                    <strong className="font-bold"> {formatCurrencyCOP(dailyBudget)} / Día</strong>
                  </InfoAlert>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-center gap-4 border-t border-divider bg-surface p-4">
                <div className="flex w-full items-center gap-4">
                  <Button variant="outline" onClick={requestClose}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate} disabled={!canSubmit} className="flex-1">
                    Modificar
                  </Button>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<img src={trashIcon} alt="" className="h-[19px] w-[17px]" />}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
