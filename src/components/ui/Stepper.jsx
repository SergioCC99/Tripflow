import { Fragment } from 'react';
import clsx from 'clsx';
import checkIcon from '../../assets/icons/check.svg';

const STEPS = [1, 2, 3, 4];

export function Stepper({ currentStep }) {
  return (
    <div className="flex w-full items-center gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <Fragment key={step}>
            <div
              className={clsx(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                isCompleted && 'bg-brand',
                isCurrent && 'bg-ink text-inverse',
                !isCompleted && !isCurrent && 'border border-ink text-ink',
              )}
            >
              {isCompleted ? <img src={checkIcon} alt="" className="h-2 w-3" /> : step}
            </div>
            {index < STEPS.length - 1 && <div className="h-px flex-1 bg-ink" />}
          </Fragment>
        );
      })}
    </div>
  );
}
