import clsx from 'clsx';

export function Button({ icon, children, className, ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center gap-[4px] rounded-full bg-ink p-4 font-bold text-inverse transition-opacity hover:opacity-90',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {icon}
    </button>
  );
}
