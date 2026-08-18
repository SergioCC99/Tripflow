export const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Tarjeta',
    emoji: '💳',
    keywords: ['tarjeta', 'card', 'credito', 'debito'],
  },
  {
    id: 'cash',
    label: 'Efectivo',
    emoji: '💵',
    keywords: ['efectivo', 'cash'],
  },
];

export const DEFAULT_PAYMENT_METHOD_ID = 'cash';

export function getPaymentMethod(paymentMethodId) {
  return (
    PAYMENT_METHODS.find((method) => method.id === paymentMethodId) ??
    PAYMENT_METHODS.find((method) => method.id === DEFAULT_PAYMENT_METHOD_ID)
  );
}
