const CURRENCY_FORMAT = {
  INR: { symbol: '₹',   locale: 'en-IN' },
  NOK: { symbol: 'kr',  locale: 'nb-NO' },
  SEK: { symbol: 'kr',  locale: 'sv-SE' },
  DKK: { symbol: 'kr',  locale: 'da-DK' },
  USD: { symbol: '$',   locale: 'en-US' },
  EUR: { symbol: '€',   locale: 'de-DE' },
  GBP: { symbol: '£',   locale: 'en-GB' },
  JPY: { symbol: '¥',   locale: 'ja-JP' },
  AUD: { symbol: 'A$',  locale: 'en-AU' },
  CAD: { symbol: 'CA$', locale: 'en-CA' },
}

export const formatPrice = (price, currency) => {
  const n = Number(price)
  if (isNaN(n) || n === 0) return 'See site'
  const fmt = CURRENCY_FORMAT[currency?.toUpperCase()] ?? { symbol: currency ?? '', locale: 'en-US' }
  return fmt.symbol + n.toLocaleString(fmt.locale)
}
