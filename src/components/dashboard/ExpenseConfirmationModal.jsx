import { ExpenseConfirmationCard } from './ExpenseConfirmationCard';
import checkIcon from '../../assets/icons/check.svg';

export function ExpenseConfirmationModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:flex lg:items-center lg:justify-center lg:bg-ink/40 lg:p-6">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 hidden lg:block" />

      <div
        className="relative flex h-full w-full flex-col justify-end bg-ink/40 lg:h-auto lg:w-auto lg:justify-center lg:bg-transparent"
        onClick={onClose}
      >
        <div onClick={(event) => event.stopPropagation()}>
          <ExpenseConfirmationCard
            icon={checkIcon}
            iconClassName="h-[27px] w-[38px]"
            circleClassName="bg-brand"
            title="¡Gasto registrado con éxito!"
            description="Tu gasto se ha añadido correctamente a tu viaje."
            onContinue={onClose}
          />
        </div>
      </div>
    </div>
  );
}
