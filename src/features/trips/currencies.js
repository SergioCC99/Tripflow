export const CURRENCIES = [
  { code: 'COP', label: 'Peso Colombiano (COP)', name: 'Peso', symbol: '$' },
  { code: 'USD', label: 'Dólar estadounidense (USD)', name: 'Dólar', symbol: '$' },
  { code: 'EUR', label: 'Euro (EUR)', name: 'Euro', symbol: '€' },
  { code: 'JPY', label: 'Yen japonés (JPY)', name: 'Yen', symbol: '¥' },
  { code: 'GBP', label: 'Libra esterlina (GBP)', name: 'Libra', symbol: '£' },
  { code: 'MXN', label: 'Peso mexicano (MXN)', name: 'Peso mexicano', symbol: '$' },
  { code: 'BRL', label: 'Real brasileño (BRL)', name: 'Real', symbol: 'R$' },
];

export function getCurrency(code) {
  return CURRENCIES.find((currency) => currency.code === code);
}
