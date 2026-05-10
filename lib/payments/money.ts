export function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat('fr-HT', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amountCents / 100);
}
