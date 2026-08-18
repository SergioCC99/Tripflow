import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTrips } from '../features/trips/TripsProvider';
import { useExpenses } from '../features/expenses/ExpensesProvider';
import { Avatar } from '../components/ui/Avatar';
import { ButtonBack } from '../components/ui/ButtonBack';
import { BudgetSummary } from '../components/dashboard/BudgetSummary';
import { TripAlertBanner } from '../components/dashboard/TripAlertBanner';
import { MetricCard } from '../components/dashboard/MetricCard';
import { DashboardChart } from '../components/dashboard/DashboardChart';
import { ExpenseHistoryList } from '../components/dashboard/ExpenseHistoryList';
import { AddExpenseBar } from '../components/dashboard/AddExpenseBar';
import { EditExpenseSheet } from '../components/dashboard/EditExpenseSheet';
import { countTripDays, formatCurrencyCOP, formatShortDate } from '../lib/format';
import dotIcon from '../assets/icons/dot.svg';
import editIcon from '../assets/icons/edit.svg';

function getElapsedAndRemainingDays(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const clampedToday = today < start ? start : today > end ? end : today;

  const elapsedDays = Math.max(1, Math.round((clampedToday - start) / 86_400_000) + 1);
  const remainingDays = Math.max(0, Math.round((end - clampedToday) / 86_400_000));

  return { elapsedDays, remainingDays };
}

export function TripDashboardPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const { expensesByTrip, getTripSpent } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);

  const trip = trips.find((candidate) => candidate.id === tripId);

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
        <h1 className="text-2xl font-bold text-ink">Viaje no encontrado</h1>
        <Link to="/" className="text-sm font-bold text-ink underline">
          Volver al hub de viajes
        </Link>
      </div>
    );
  }

  const expenses = expensesByTrip(trip.id);
  const spentAmount = getTripSpent(trip.id);
  const totalDays = countTripDays(trip.startDate, trip.endDate);
  const { elapsedDays, remainingDays } = getElapsedAndRemainingDays(trip.startDate, trip.endDate);
  const dailyBudget = trip.totalBudget / totalDays;
  const avgDailySpend = spentAmount / elapsedDays;

  return (
    <div className="min-h-screen bg-surface pb-32 lg:pb-24">
      <header className="relative flex items-center gap-4 border-b border-ink-secondary bg-surface-muted p-4 lg:px-6 lg:py-4">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-4">
          <ButtonBack label="Volver" showLabel={false} onClick={() => navigate('/')} />

          <div className="flex flex-1 flex-col items-start gap-1">
            <h1 className="text-2xl font-bold text-ink">{trip.destination}</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{formatShortDate(trip.startDate)}</span>
                <span className="h-px w-2 bg-muted" />
                <span className="text-xs text-muted">{formatShortDate(trip.endDate)}</span>
              </div>
              <img src={dotIcon} alt="" className="size-1" />
              <span className="text-xs text-muted">{totalDays} días</span>
              <img src={editIcon} alt="" className="size-[14px]" />
            </div>
          </div>

          <Avatar name="Paula" className="size-14" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 lg:px-6">
        <TripAlertBanner trip={trip} spentAmount={spentAmount} />

        <BudgetSummary trip={trip} spentAmount={spentAmount} />

        <div className="flex w-full gap-4">
          <MetricCard
            label="Gasto / Día"
            value={formatCurrencyCOP(avgDailySpend)}
            subLabel={`De ${formatCurrencyCOP(dailyBudget)}`}
            sheetTitle="Gasto por día"
            sheetDescription="Es el promedio de lo que has gastado por cada día transcurrido del viaje. Lo comparamos con tu presupuesto diario planeado, que resulta de dividir el presupuesto total entre la duración total del viaje."
          />
          <MetricCard
            label="Días restantes"
            value={remainingDays}
            subLabel={`De ${totalDays}`}
            sheetTitle="Días restantes"
            sheetDescription="Cantidad de días que faltan para que termine tu viaje, sobre el total de días planeados para esta aventura."
          />
        </div>

        <div className="h-px w-full bg-divider" />

        <DashboardChart trip={trip} expenses={expenses} />

        <div className="h-px w-full bg-divider" />

        <div className="flex w-full flex-col gap-6">
          <h2 className="text-xl font-bold text-ink">Historial de gastos</h2>
          <ExpenseHistoryList expenses={expenses} onSelectExpense={setEditingExpense} />
        </div>
      </main>

      <AddExpenseBar trip={trip} />

      <EditExpenseSheet
        trip={trip}
        expense={editingExpense}
        open={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
      />
    </div>
  );
}
