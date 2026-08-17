import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({ icon, children, className, ...props }: ButtonProps) {
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
