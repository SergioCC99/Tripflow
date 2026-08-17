import clsx from 'clsx';

export function Button({ icon, children, className, variant = 'solid', size = 'md', ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center gap-[4px] rounded-full font-bold transition-all duration-150 hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40',
        size === 'md' && 'p-4',
        size === 'sm' && 'px-4 py-3 text-sm',
        variant === 'solid' && 'bg-ink text-inverse',
        variant === 'outline' && 'border border-ink text-ink',
        variant === 'white' && 'border border-ink bg-surface text-ink',
        className,
      )}
      {...props}
    >
      {children && <span>{children}</span>}
      {icon}
    </button>
  );
}
