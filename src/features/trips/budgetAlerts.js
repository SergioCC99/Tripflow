import { formatCurrencyCOP } from '../../lib/format';

export function getBudgetAlert(spent, budget) {
  if (budget <= 0) return null;

  const percent = Math.round((spent / budget) * 100);
  const excess = spent - budget;

  if (percent >= 90) {
    const message =
      excess > 0
        ? `Llevas ${formatCurrencyCOP(excess)} por encima de tu límite. Revisa tus gastos para saber dónde puedes ajustar.`
        : `Ya superaste el ${percent}% de tu presupuesto. Revisa tus gastos para saber dónde puedes ajustar.`;
    return { variant: 'danger', message };
  }

  if (percent > 75) {
    return {
      variant: 'warning',
      message: `Ya superaste el ${percent}% de tu presupuesto. Revisa tus próximos gastos para mantenerte dentro del límite.`,
    };
  }

  return {
    variant: 'ok',
    message: `Has utilizado el ${percent}% de tu presupuesto. Todavía tienes margen para disfrutar el resto del viaje.`,
  };
}
