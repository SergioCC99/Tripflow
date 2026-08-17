import clsx from 'clsx';

export function TabGroup({ options, value, onChange, size = 'md' }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={clsx(
              'cursor-pointer rounded-full border border-ink transition-colors',
              size === 'md' && 'px-4 py-3 text-sm',
              size === 'sm' && 'px-3 py-2 text-xs',
              isActive ? 'bg-ink text-inverse' : 'bg-surface text-ink hover:bg-surface-muted',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
