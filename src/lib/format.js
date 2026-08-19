const SHORT_MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const currencyFormatter = new Intl.NumberFormat('es-CO');

function parseIsoDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`);
}

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayIso() {
  return toISODate(new Date());
}

export function formatCurrencyCOP(amount) {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}$${currencyFormatter.format(Math.abs(rounded))}`;
}

export function formatShortDate(isoDate) {
  const date = parseIsoDate(isoDate);
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

export function countTripDays(startIso, endIso) {
  const diffMs = parseIsoDate(endIso).getTime() - parseIsoDate(startIso).getTime();
  return Math.round(diffMs / 86_400_000) + 1;
}

export function formatThousands(value) {
  const digits = String(value).replace(/\D/g, '');
  return digits ? currencyFormatter.format(Number(digits)) : '';
}

export function parseThousands(formatted) {
  const digits = String(formatted).replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function formatCompactAmount(amount) {
  const value = Math.abs(amount);

  if (value >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(amount / 1_000)}K`;
  }
  return `${Math.round(amount)}`;
}
