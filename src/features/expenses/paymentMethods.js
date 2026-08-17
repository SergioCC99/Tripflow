export const PAYMENT_METHODS = [
  {
    id: 'cash',
    label: 'Efectivo',
    keywords: ['efectivo', 'cash'],
  },
  {
    id: 'card',
    label: 'Tarjeta',
    keywords: ['tarjeta', 'card', 'credito', 'debito'],
  },
];

export const DEFAULT_PAYMENT_METHOD_ID = 'cash';

export function getPaymentMethod(paymentMethodId) {
  return (
    PAYMENT_METHODS.find((method) => method.id === paymentMethodId) ??
    PAYMENT_METHODS.find((method) => method.id === DEFAULT_PAYMENT_METHOD_ID)
  );
}
