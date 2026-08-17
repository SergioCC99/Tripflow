import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ButtonBack } from '../components/ui/ButtonBack';
import { TextField } from '../components/ui/TextField';
import { DateField } from '../components/ui/DateField';
import { CurrencySelect } from '../components/ui/CurrencySelect';
import { InfoAlert } from '../components/ui/InfoAlert';
import { Stepper } from '../components/ui/Stepper';
import { PhotoUploadField } from '../components/ui/PhotoUploadField';
import { useTrips } from '../features/trips/TripsProvider';
import { deriveTripStatus } from '../features/trips/deriveTripStatus';
import { countTripDays, formatCurrencyCOP, formatThousands, parseThousands } from '../lib/format';
import checkIcon from '../assets/icons/check.svg';
import dollarIcon from '../assets/icons/dollar.svg';

const STEP_COUNT = 4;

const INITIAL_FORM = {
  destination: '',
  coverPhoto: '',
  startDate: '',
  endDate: '',
  currency: 'COP',
  totalBudget: 0,
};

export function NewTripWizard() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const close = () => navigate('/');
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const hasValidDates = Boolean(form.startDate && form.endDate && form.startDate <= form.endDate);
  const days = hasValidDates ? countTripDays(form.startDate, form.endDate) : null;
  const dailyBudget = days ? Math.round(form.totalBudget / days) : 0;

  const canProceed = [
    form.destination.trim().length > 0,
    hasValidDates,
    Boolean(form.currency),
    form.totalBudget > 0,
  ][step - 1];

  const goBack = () => (step === 1 ? close() : setStep((current) => current - 1));

  const goNext = () => {
    if (step < STEP_COUNT) {
      setStep((current) => current + 1);
      return;
    }

    addTrip({
      id: crypto.randomUUID(),
      destination: form.destination.trim(),
      imageUrl: form.coverPhoto,
      startDate: form.startDate,
      endDate: form.endDate,
      currency: form.currency,
      totalBudget: form.totalBudget,
      status: deriveTripStatus(form.startDate, form.endDate),
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:bg-ink/40 lg:p-6">
      <button type="button" aria-label="Cerrar" onClick={close} className="absolute inset-0 hidden lg:block" />

      {submitted ? (
        <div className="relative flex h-full w-full flex-col justify-end bg-ink/40 lg:h-auto lg:w-auto lg:justify-center lg:bg-transparent">
          <ConfirmationCard onContinue={close} />
        </div>
      ) : (
        <div className="relative flex size-full flex-col bg-surface lg:h-auto lg:max-h-[calc(100vh-48px)] lg:w-full lg:max-w-[685px] lg:overflow-y-auto lg:rounded-2xl lg:shadow-xl">
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 lg:p-6">
              <ButtonBack onClick={goBack} />

              <div className="flex flex-1 flex-col items-center gap-6">
                <Stepper currentStep={step} />

                {step === 1 && (
                  <>
                    <StepHeading title="¿A dónde vas?" description="Elige un nombre para tu próxima aventura." />
                    <TextField
                      label="Destino"
                      placeholder='Ej. "Madrid" o "Viaje prom"'
                      value={form.destination}
                      onChange={(event) => update({ destination: event.target.value })}
                    />
                    <PhotoUploadField
                      value={form.coverPhoto}
                      onChange={(coverPhoto) => update({ coverPhoto })}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <StepHeading title="¿Cuándo será?" description="Elige las fechas de tu viaje" />
                    <div className="flex w-full gap-4">
                      <DateField
                        label="Inicio"
                        value={form.startDate}
                        onChange={(event) => update({ startDate: event.target.value })}
                        className="flex-1"
                      />
                      <DateField
                        label="Fin"
                        value={form.endDate}
                        min={form.startDate || undefined}
                        onChange={(event) => update({ endDate: event.target.value })}
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
                  </>
                )}

                {step === 3 && (
                  <>
                    <StepHeading
                      title="Elige la moneda"
                      description="La moneda elegida define cómo se muestran el presupuesto, los gastos y los totales."
                    />
                    <CurrencySelect
                      value={form.currency}
                      onChange={(event) => update({ currency: event.target.value })}
                    />
                    <InfoAlert>Si registras un gasto en otra moneda, lo convertimos automáticamente.</InfoAlert>
                  </>
                )}

                {step === 4 && (
                  <>
                    <StepHeading
                      title="¿Cuánto te vas a gastar?"
                      description={`Define tu presupuesto total para ${days ?? 0} días.`}
                    />
                    <TextField
                      label="Presupuesto total"
                      icon={dollarIcon}
                      inputMode="numeric"
                      placeholder="0"
                      value={form.totalBudget ? formatThousands(form.totalBudget) : ''}
                      onChange={(event) => update({ totalBudget: parseThousands(event.target.value) })}
                    />
                    <InfoAlert>
                      Tu presupuesto diario:
                      <strong className="font-bold"> {formatCurrencyCOP(dailyBudget)} / Día</strong>
                    </InfoAlert>
                  </>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 border-t border-divider bg-surface p-4 lg:justify-end">
              <Button variant="outline" onClick={goBack}>
                {step === 1 ? 'Cancelar' : 'Anterior'}
              </Button>
              <Button onClick={goNext} disabled={!canProceed} className="flex-1 lg:flex-none">
                {step === STEP_COUNT ? 'Crear presupuesto' : 'Siguiente'}
              </Button>
            </div>
        </div>
      )}
    </div>
  );
}

function StepHeading({ title, description }) {
  return (
    <div className="flex w-full flex-col items-start gap-1 text-ink">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm">{description}</p>
    </div>
  );
}

function ConfirmationCard({ onContinue }) {
  return (
    <div className="flex w-full flex-col items-center gap-16 rounded-t-3xl bg-surface px-8 py-16 lg:w-[480px] lg:rounded-2xl lg:py-8 lg:shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-[100px] items-center justify-center rounded-full bg-brand">
          <img src={checkIcon} alt="" className="h-[27px] w-[38px]" />
        </div>
        <p className="text-center text-2xl font-bold text-ink">¡Presupuesto creado con éxito!</p>
        <p className="text-center text-base text-muted">
          ¡Tu aventura está en marcha! Has creado tu presupuesto con éxito. Ahora, a disfrutar y administrar tu
          dinero.
        </p>
      </div>
      <Button onClick={onContinue} className="w-full lg:w-auto">
        Continuar
      </Button>
    </div>
  );
}
