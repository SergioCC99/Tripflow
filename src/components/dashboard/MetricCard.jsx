import { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import infoCircleIcon from '../../assets/icons/info-circle.svg';

export function MetricCard({ label, value, subLabel, sheetTitle, sheetDescription }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-[105px] flex-1 flex-col justify-center gap-1 rounded-2xl bg-surface-muted p-3">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-muted">{label}</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Información sobre ${label}`}
          className="shrink-0 cursor-pointer"
        >
          <img src={infoCircleIcon} alt="" className="size-[19px]" />
        </button>
      </div>
      <span className="text-xl font-bold text-ink">{value}</span>
      <span className="text-sm text-muted">{subLabel}</span>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={sheetTitle}>
        <p className="text-base text-muted">{sheetDescription}</p>
      </BottomSheet>
    </div>
  );
}
