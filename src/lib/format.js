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

export function formatCurrencyCOP(amount) {
  return `$${currencyFormatter.format(Math.round(amount))}`;
}

export function formatShortDate(isoDate) {
  const date = parseIsoDate(isoDate);
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

export function countTripDays(startIso, endIso) {
  const diffMs = parseIsoDate(endIso).getTime() - parseIsoDate(startIso).getTime();
  return Math.round(diffMs / 86_400_000) + 1;
}
