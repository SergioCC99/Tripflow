import { CATEGORIES, DEFAULT_CATEGORY_ID } from './categories';
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD_ID } from './paymentMethods';

const AMOUNT_PATTERN = /\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(k|mil|m|millon(?:es)?)?\b\s*(pesos|cop)?/i;

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function parseAmount(normalizedText) {
  const match = normalizedText.match(AMOUNT_PATTERN);
  if (!match) return { amount: null, matchedText: '' };

  const [matchedText, numberPart, suffix] = match;
  let amount = Number(numberPart.replace(/[.,]/g, ''));

  if (suffix === 'k' || suffix === 'mil') amount *= 1_000;
  if (suffix === 'm' || suffix?.startsWith('millon')) amount *= 1_000_000;

  return { amount, matchedText };
}

function matchKeyword(normalizedText, entries) {
  for (const entry of entries) {
    for (const keyword of entry.keywords) {
      if (normalizedText.includes(keyword)) {
        return { id: entry.id, keyword };
      }
    }
  }
  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildDescription(rawText, matchedAmountText, paymentKeyword) {
  let description = rawText.trim();

  if (matchedAmountText) {
    description = description.replace(new RegExp(escapeRegExp(matchedAmountText), 'i'), '').trim();
  }
  if (paymentKeyword) {
    description = description.replace(new RegExp(escapeRegExp(paymentKeyword), 'i'), '').trim();
  }

  description = description
    .replace(/\s{2,}/g, ' ')
    .replace(/^(en|con|de|por)\s+/i, '')
    .replace(/\s+(en|con|de|por)$/i, '')
    .trim();

  if (!description) return 'Gasto';
  return description.charAt(0).toUpperCase() + description.slice(1);
}

export function classifyExpenseText(text) {
  const normalized = normalize(text.trim());

  const { amount, matchedText } = parseAmount(normalized);
  const categoryMatch = matchKeyword(normalized, CATEGORIES);
  const paymentMatch = matchKeyword(normalized, PAYMENT_METHODS);

  return {
    amount: amount ?? 0,
    categoryId: categoryMatch?.id ?? DEFAULT_CATEGORY_ID,
    paymentMethodId: paymentMatch?.id ?? DEFAULT_PAYMENT_METHOD_ID,
    description: buildDescription(text, matchedText, paymentMatch?.keyword),
  };
}
