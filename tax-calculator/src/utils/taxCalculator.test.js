import { describe, it, expect } from 'vitest'
import { calculateTax, formatCurrency, formatPercentage } from '../utils/taxCalculator'

describe('taxCalculator utility', () => {
  const mockTaxBands = [
    { bandStart: 0, bandEnd: 14000, taxRate: 0.115 },
    { bandStart: 14000, bandEnd: 48000, taxRate: 0.21 },
    { bandStart: 48000, bandEnd: 70000, taxRate: 0.315 },
    { bandStart: 70000, bandEnd: null, taxRate: 0.355 },
  ]

  describe('calculateTax', () => {
    it('should return zero tax for zero salary', () => {
      const result = calculateTax(0, mockTaxBands)
      expect(result.totalTax).toBe(0)
      expect(result.effectiveRate).toBe(0)
      expect(result.netIncome).toBe(0)
      expect(result.breakdown).toHaveLength(0)
    })

    it('should return zero tax for negative salary', () => {
      const result = calculateTax(-1000, mockTaxBands)
      expect(result.totalTax).toBe(0)
      expect(result.effectiveRate).toBe(0)
    })

    it('should calculate tax correctly for salary in first band ($10,000)', () => {
      const salary = 10000
      const result = calculateTax(salary, mockTaxBands)

      // Tax = 10000 * 0.1150 = 1150
      expect(result.totalTax).toBe(1150)
      expect(result.netIncome).toBe(8850)
      expect(result.effectiveRate).toBe(11.5)
      expect(result.breakdown).toHaveLength(1)
    })

    it('should calculate tax correctly for salary at first band boundary ($14,000)', () => {
      const salary = 14000
      const result = calculateTax(salary, mockTaxBands)

      // Tax = 14000 * 0.1150 = 1610
      expect(result.totalTax).toBe(1610)
      expect(result.netIncome).toBe(12390)
      expect(result.breakdown).toHaveLength(1)
    })

    it('should calculate tax correctly for salary spanning two bands ($30,000)', () => {
      const salary = 30000
      const result = calculateTax(salary, mockTaxBands)

      // Band 1: 14000 * 0.1150 = 1610
      // Band 2: 16000 * 0.2100 = 3360
      // Total: 4970
      expect(result.totalTax).toBe(4970)
      expect(result.netIncome).toBe(25030)
      expect(result.effectiveRate).toBeCloseTo(16.57, 1)
      expect(result.breakdown).toHaveLength(2)
    })

    it('should calculate tax correctly for salary spanning three bands ($60,000)', () => {
      const salary = 60000
      const result = calculateTax(salary, mockTaxBands)

      // Band 1: 14000 * 0.1150 = 1610
      // Band 2: 34000 * 0.2100 = 7140
      // Band 3: 12000 * 0.3150 = 3780
      // Total: 12530
      expect(result.totalTax).toBe(12530)
      expect(result.netIncome).toBe(47470)
      expect(result.effectiveRate).toBeCloseTo(20.88, 1)
      expect(result.breakdown).toHaveLength(3)
    })

    it('should calculate tax correctly for salary in highest band ($100,000)', () => {
      const salary = 100000
      const result = calculateTax(salary, mockTaxBands)

      // Band 1: 14000 * 0.1150 = 1610
      // Band 2: 34000 * 0.2100 = 7140
      // Band 3: 22000 * 0.3150 = 6930
      // Band 4: 30000 * 0.3550 = 10650
      // Total: 26330
      expect(result.totalTax).toBe(26330)
      expect(result.netIncome).toBe(73670)
      expect(result.effectiveRate).toBeCloseTo(26.33, 1)
      expect(result.breakdown).toHaveLength(4)
    })

    it('should handle decimal salaries correctly', () => {
      const salary = 25500.75
      const result = calculateTax(salary, mockTaxBands)

      expect(result.totalTax).toBeGreaterThan(0)
      expect(result.netIncome).toBe(parseFloat((salary - result.totalTax).toFixed(2)))
      expect(result.totalTax + result.netIncome).toBeCloseTo(salary, 1)
    })

    it('should ensure breakdown amounts sum to total tax', () => {
      const salary = 55000
      const result = calculateTax(salary, mockTaxBands)

      const breakdownSum = result.breakdown.reduce((sum, band) => sum + band.taxAmount, 0)
      expect(breakdownSum).toBeCloseTo(result.totalTax, 1)
    })

    it('should include correct tax band information in breakdown', () => {
      const salary = 50000
      const result = calculateTax(salary, mockTaxBands)

      expect(result.breakdown[0]).toMatchObject({
        bandStart: 0,
        bandEnd: 14000,
        taxRate: 0.115,
        taxableAmount: 14000,
      })

      expect(result.breakdown[1]).toMatchObject({
        bandStart: 14000,
        bandEnd: 48000,
        taxRate: 0.21,
        taxableAmount: 34000,
      })
    })

    it('should handle salary exactly at band boundary', () => {
      const salary = 48000
      const result = calculateTax(salary, mockTaxBands)

      expect(result.breakdown).toHaveLength(2)
      expect(result.breakdown[1].taxableAmount).toBe(34000)
    })

    it('should work with unsorted tax bands', () => {
      const unsortedBands = [
        { bandStart: 48000, bandEnd: 70000, taxRate: 0.315 },
        { bandStart: 0, bandEnd: 14000, taxRate: 0.115 },
        { bandStart: 70000, bandEnd: null, taxRate: 0.355 },
        { bandStart: 14000, bandEnd: 48000, taxRate: 0.21 },
      ]

      const salary = 50000
      const result = calculateTax(salary, unsortedBands)

      expect(result.totalTax).toBeGreaterThan(0)
      expect(result.breakdown).toHaveLength(3)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive numbers as currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-500)).toBe('-$500.00')
    })

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(10.999)).toBe('$11.00')
      expect(formatCurrency(10.001)).toBe('$10.00')
    })

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99')
    })
  })

  describe('formatPercentage', () => {
    it('should format whole numbers correctly', () => {
      expect(formatPercentage(10)).toBe('10.00%')
      expect(formatPercentage(100)).toBe('100.00%')
    })

    it('should format decimal numbers correctly', () => {
      expect(formatPercentage(10.5)).toBe('10.50%')
      expect(formatPercentage(33.33333)).toBe('33.33%')
    })

    it('should format zero correctly', () => {
      expect(formatPercentage(0)).toBe('0.00%')
    })

    it('should format negative percentages', () => {
      expect(formatPercentage(-5.25)).toBe('-5.25%')
    })

    it('should round to 2 decimal places', () => {
      expect(formatPercentage(10.999)).toBe('11.00%')
      expect(formatPercentage(10.001)).toBe('10.00%')
    })
  })

  describe('edge cases', () => {
    it('should handle empty tax bands array', () => {
      const result = calculateTax(50000, [])
      expect(result.totalTax).toBe(0)
      expect(result.breakdown).toHaveLength(0)
    })

    it('should handle very large salary', () => {
      const salary = 10000000
      const result = calculateTax(salary, mockTaxBands)

      expect(result.totalTax).toBeGreaterThan(0)
      expect(result.netIncome).toBe(salary - result.totalTax)
      expect(result.effectiveRate).toBeGreaterThan(0)
    })

    it('should handle salary of $1', () => {
      const result = calculateTax(1, mockTaxBands)

      expect(result.totalTax).toBe(0.12)
      expect(result.netIncome).toBeCloseTo(0.88, 1)
    })
  })
})
