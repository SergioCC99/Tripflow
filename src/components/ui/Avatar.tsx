import clsx from 'clsx';

interface AvatarProps {
  name: string;
  photoUrl?: string;
  className?: string;
}

export function Avatar({ name, photoUrl, className }: AvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={clsx('shrink-0 rounded-full object-cover', className)}
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      role="img"
      aria-label={name}
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full bg-ink text-inverse',
        className,
      )}
    >
      <span className="text-lg font-bold">{initial}</span>
    </div>
  );
}
