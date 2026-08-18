import { useEffect, useState } from 'react';
import { InfoAlert } from '../ui/InfoAlert';
import { getBudgetAlert } from '../../features/trips/budgetAlerts';

const OK_ALERT_DURATION_MS = 10000;

export function TripAlertBanner({ trip, spentAmount }) {
  const alert = getBudgetAlert(spentAmount, trip.totalBudget);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [alert?.variant]);

  useEffect(() => {
    if (alert?.variant !== 'ok') return undefined;

    const timer = setTimeout(() => setDismissed(true), OK_ALERT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [alert?.variant]);

  if (!alert || dismissed) return null;

  return (
    <InfoAlert
      variant={alert.variant}
      onDismiss={() => setDismissed(true)}
      durationMs={alert.variant === 'ok' ? OK_ALERT_DURATION_MS : undefined}
    >
      {alert.message}
    </InfoAlert>
  );
}
