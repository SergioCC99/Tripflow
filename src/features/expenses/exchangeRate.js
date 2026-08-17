const rateCache = new Map();

export async function fetchExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;

  const cacheKey = `${fromCurrency}->${toCurrency}`;
  if (rateCache.has(cacheKey)) return rateCache.get(cacheKey);

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
    if (!response.ok) throw new Error(`Exchange rate request failed: ${response.status}`);

    const data = await response.json();
    const rate = data?.rates?.[toCurrency];
    if (typeof rate !== 'number') throw new Error(`No rate found for ${toCurrency}`);

    rateCache.set(cacheKey, rate);
    return rate;
  } catch {
    return null;
  }
}
