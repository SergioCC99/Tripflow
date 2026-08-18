import clsx from 'clsx';
import { Button } from '../ui/Button';

export function ExpenseConfirmationCard({ icon, iconClassName, circleClassName, title, description, onContinue }) {
  return (
    <div className="animate-slide-up-in flex w-full flex-col items-center gap-16 rounded-t-3xl bg-surface px-8 py-16 lg:w-[480px] lg:rounded-2xl lg:py-8 lg:shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <div className={clsx('flex size-[100px] items-center justify-center rounded-full', circleClassName)}>
          <img src={icon} alt="" className={iconClassName} />
        </div>
        <p className="text-center text-2xl font-bold text-ink">{title}</p>
        <p className="text-center text-base text-muted">{description}</p>
      </div>
      <Button onClick={onContinue} className="w-full lg:w-auto">
        Continuar
      </Button>
    </div>
  );
}
