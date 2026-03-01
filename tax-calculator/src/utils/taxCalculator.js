/**
 * Calculate tax based on salary and tax bands
 * @param {number} salary - The annual salary
 * @param {Array} taxBands - Array of tax band objects with bandStart, bandEnd, and taxRate
 * @returns {Object} - Object containing totalTax, effectiveRate, and breakdown by band
 */
export function calculateTax(salary, taxBands) {
  if (!salary || salary <= 0) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      breakdown: [],
      netIncome: 0,
    }
  }

  let totalTax = 0
  const breakdown = []

  // Sort tax bands by bandStart to ensure correct calculation
  const sortedBands = [...taxBands].sort((a, b) => a.bandStart - b.bandStart)

  for (const band of sortedBands) {
    const { bandStart, bandEnd, taxRate } = band

    // Skip if salary doesn't reach this band
    if (salary <= bandStart) {
      continue
    }

    // Calculate the taxable amount in this band
    const upperLimit = bandEnd === null ? salary : Math.min(salary, bandEnd)
    const taxableInBand = upperLimit - bandStart

    if (taxableInBand > 0) {
      const taxInBand = taxableInBand * taxRate
      totalTax += taxInBand

      breakdown.push({
        bandStart,
        bandEnd,
        taxRate,
        taxableAmount: taxableInBand,
        taxAmount: taxInBand,
      })
    }
  }

  const effectiveRate = salary > 0 ? (totalTax / salary) * 100 : 0
  const netIncome = salary - totalTax

  return {
    totalTax: parseFloat(totalTax.toFixed(2)),
    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
    breakdown,
    netIncome: parseFloat(netIncome.toFixed(2)),
  }
}

/**
 * Format currency for display
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage for display
 * @param {number} rate
 * @returns {string}
 */
export function formatPercentage(rate) {
  return `${rate.toFixed(2)}%`
}
