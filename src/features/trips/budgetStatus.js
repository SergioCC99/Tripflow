export function getBudgetStatus(spent, budget) {
  if (budget <= 0) return 'default';

  const percent = spent / budget;
  if (percent >= 0.9) return 'danger';
  if (percent > 0.75) return 'warning';
  return 'default';
}
