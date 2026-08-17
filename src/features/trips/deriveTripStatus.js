export function deriveTripStatus(startDate, endDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'completed';
  return 'ongoing';
}
