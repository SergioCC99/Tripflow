import { Link } from 'react-router-dom';

export function ComingSoonPage({ title }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="text-base text-muted">Esta sección se construirá en la siguiente iteración.</p>
      <Link to="/" className="text-sm font-bold text-ink underline">
        Volver al hub de viajes
      </Link>
    </div>
  );
}
