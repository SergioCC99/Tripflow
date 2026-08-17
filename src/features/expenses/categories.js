export const CATEGORIES = [
  {
    id: 'food',
    label: 'Comida',
    emoji: '🍔',
    keywords: [
      'comida',
      'cena',
      'almuerzo',
      'desayuno',
      'restaurante',
      'restaurant',
      'comer',
      'cafe',
      'bar',
      'bebida',
      'snack',
      'mercado',
      'supermercado',
    ],
  },
  {
    id: 'lodging',
    label: 'Hospedaje',
    emoji: '🏨',
    keywords: ['hotel', 'hostal', 'hospedaje', 'airbnb', 'alojamiento', 'habitacion'],
  },
  {
    id: 'transport',
    label: 'Transporte',
    emoji: '🚗',
    keywords: [
      'taxi',
      'uber',
      'bus',
      'tren',
      'metro',
      'avion',
      'vuelo',
      'gasolina',
      'peaje',
      'transporte',
      'transfer',
    ],
  },
  {
    id: 'entertainment',
    label: 'Entretenimiento',
    emoji: '🎉',
    keywords: [
      'entrada',
      'boleto',
      'tour',
      'museo',
      'karaoke',
      'cine',
      'parque',
      'excursion',
      'concierto',
      'show',
    ],
  },
  {
    id: 'general',
    label: 'General',
    emoji: '🏷️',
    keywords: [],
  },
];

export const DEFAULT_CATEGORY_ID = 'general';

export function getCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? CATEGORIES.find((c) => c.id === DEFAULT_CATEGORY_ID);
}
