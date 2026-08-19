import { todayIso } from '../../lib/format';

export function deriveTripStatus(startDate, endDate) {
  const today = todayIso();
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'completed';
  return 'ongoing';
}
