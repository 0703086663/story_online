export function calculateAverageRate(rates) {
  if (rates.length === 0) return 0

  const totalRates = rates.reduce((acc, rate) => acc + rate.rating, 0)
  return totalRates / rates.length
}
