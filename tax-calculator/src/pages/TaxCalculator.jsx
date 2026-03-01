import { useMemo, useRef, useState } from 'react'
import { calculateTax, formatCurrency, formatPercentage } from '../utils/taxCalculator'
import ModalPortal from '../components/ModalPortal'
import useTaxBands from '../hooks/useTaxBands'
import taxBandIcon from '../assets/tax-band.png'

const SALARY_INPUT_PATTERN = /^\d*\.?\d*$/

function stripFormatting(value) {
  return value.replace(/,/g, '')
}

function formatSalaryInput(value) {
  if (!value) {
    return ''
  }

  const [integerPart, decimalPart] = value.split('.')
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (value.includes('.')) {
    return `${formattedInteger}.${decimalPart ?? ''}`
  }

  return formattedInteger
}

function getCaretIndex(formattedValue, unformattedCharsBeforeCaret) {
  if (unformattedCharsBeforeCaret <= 0) {
    return 0
  }

  let unformattedCount = 0

  for (let i = 0; i < formattedValue.length; i += 1) {
    if (formattedValue[i] !== ',') {
      unformattedCount += 1
    }

    if (unformattedCount === unformattedCharsBeforeCaret) {
      return i + 1
    }
  }

  return formattedValue.length
}

function TaxCalculator() {
  const [salary, setSalary] = useState('')
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const salaryFieldRef = useRef(null)
  const { taxBands, loading, error } = useTaxBands()

  const numericSalaryInput = useMemo(() => stripFormatting(salary), [salary])
  const parsedSalary = useMemo(() => parseFloat(numericSalaryInput), [numericSalaryInput])

  const taxResult = useMemo(() => {
    if (!salary || Number.isNaN(parsedSalary) || parsedSalary <= 0 || taxBands.length === 0) {
      return null
    }

    return calculateTax(parsedSalary, taxBands)
  }, [salary, parsedSalary, taxBands])

  const marginalBand = taxResult?.breakdown[taxResult.breakdown.length - 1]
  const showInvalidSalaryMessage = Boolean(salary && !taxResult)

  const autoResizeSalaryField = () => {
    if (!salaryFieldRef.current) {
      return
    }

    salaryFieldRef.current.style.height = 'auto'
    salaryFieldRef.current.style.height = `${salaryFieldRef.current.scrollHeight}px`
  }

  const handleSalaryChange = (e) => {
    const { value, selectionStart } = e.target
    const unformattedValue = stripFormatting(value)

    if (unformattedValue === '' || SALARY_INPUT_PATTERN.test(unformattedValue)) {
      const unformattedBeforeCaret = stripFormatting(value.slice(0, selectionStart ?? value.length))
      const formattedValue = formatSalaryInput(unformattedValue)

      setSalary(formattedValue)

      requestAnimationFrame(() => {
        autoResizeSalaryField()
        const nextCaretIndex = getCaretIndex(formattedValue, unformattedBeforeCaret.length)
        e.target.setSelectionRange(nextCaretIndex, nextCaretIndex)
      })
    }
  }

  const handleClear = () => {
    setSalary('')
    setIsDetailsOpen(false)

    requestAnimationFrame(() => {
      autoResizeSalaryField()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading tax bands...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Tax Bands</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Income Tax Calculator</h1>
          <p className="text-gray-600">Calculate your tax based on annual salary</p>
        </div>
        <div className="hidden sm:block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
          {taxBands.length} Tax Bands Active
        </div>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Enter Your Annual Salary</h2>
        </div>

        <div className="p-6 sm:p-8">
          {/* Input Section */}
          <div className="mb-8">
            <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-3">
              Annual Salary (NZD)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 pointer-events-none">
                $
              </div>
              <textarea
                ref={salaryFieldRef}
                id="salary"
                value={salary}
                onChange={handleSalaryChange}
                placeholder="Enter amount (e.g., 50000)"
                inputMode="decimal"
                autoComplete="off"
                rows={1}
                aria-invalid={showInvalidSalaryMessage}
                aria-describedby={
                  showInvalidSalaryMessage ? 'salary-help salary-error' : 'salary-help'
                }
                className="w-full min-h-[64px] pl-12 pr-14 py-4 text-lg sm:text-2xl font-semibold border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 focus:bg-white break-all leading-tight resize-none overflow-hidden"
              />
              {salary && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all hover:scale-110"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
            <p id="salary-help" className="mt-2 text-xs text-gray-500">
              Numbers only. Enter annual salary before tax.
            </p>
            {showInvalidSalaryMessage && (
              <p
                id="salary-error"
                role="status"
                className="mt-2 text-sm text-amber-600 flex items-center gap-1"
              >
                <span>⚠️</span>
                <span>Please enter a valid amount greater than 0</span>
              </p>
            )}
          </div>

          {/* Results */}
          {taxResult && (
            <div className="space-y-6 animate-fadeIn" aria-live="polite">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 border-2 border-blue-200 dark:border-slate-600 rounded-xl p-5 relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">💵</div>
                  <div className="relative min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-sky-300 mb-1">
                      Gross Income
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 break-all leading-tight">
                      {formatCurrency(parsedSalary)}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-800 dark:to-slate-700 border-2 border-red-200 dark:border-slate-600 rounded-xl p-5 relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">📉</div>
                  <div className="relative min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-rose-300 mb-1">
                      Total Tax
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 break-all leading-tight">
                      {formatCurrency(taxResult.totalTax)}
                    </p>
                    <p className="text-xs text-red-700 dark:text-rose-300 font-semibold mt-1">
                      Rate: {formatPercentage(taxResult.effectiveRate)}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-800 dark:to-slate-700 border-2 border-emerald-200 dark:border-slate-600 rounded-xl p-5 relative overflow-hidden min-w-0">
                  <div className="absolute top-0 right-0 text-6xl opacity-10">💰</div>
                  <div className="relative min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-300 mb-1">
                      Net Income
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 break-all leading-tight">
                      {formatCurrency(taxResult.netIncome)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  <span>🪟</span>
                  {/*Uses a modal mounted with React Portal.*/}
                  <span>View calculation details</span>
                </button>
              </div>

              {/* Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Tax Breakdown by Band
                </h3>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="hidden md:grid md:grid-cols-[2fr_1fr_1.5fr_1.5fr] gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold text-sm">
                    <div>Tax Band</div>
                    <div>Rate</div>
                    <div className="text-right">Taxable Amount</div>
                    <div className="text-right">Tax Amount</div>
                  </div>
                  {/* Rows */}
                  {taxResult.breakdown.map((band, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.5fr_1.5fr] gap-2 md:gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900 min-w-0 break-all">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Tax Band</span>
                        {formatCurrency(band.bandStart)} -{' '}
                        {band.bandEnd ? formatCurrency(band.bandEnd) : 'Above'}
                      </div>
                      <div className="text-blue-700 font-bold min-w-0 break-all">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Rate</span>
                        {formatPercentage(band.taxRate * 100)}
                      </div>
                      <div className="md:text-right font-semibold text-gray-700 min-w-0 break-all">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Taxable</span>
                        {formatCurrency(band.taxableAmount)}
                      </div>
                      <div className="md:text-right text-red-600 font-bold min-w-0 break-all">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Tax</span>
                        {formatCurrency(band.taxAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ModalPortal
        isOpen={isDetailsOpen && Boolean(taxResult)}
        onClose={() => setIsDetailsOpen(false)}
        title="Calculation Details"
      >
        {taxResult && (
          <div className="space-y-6">
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              Tax is calculated progressively. Each portion of your salary is taxed at the rate for
              the band it falls into, then all band-level tax amounts are summed.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Effective rate
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPercentage(taxResult.effectiveRate)}
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Marginal rate
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {marginalBand ? formatPercentage(marginalBand.taxRate * 100) : 'N/A'}
                </p>
              </article>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-600">
              <div className="border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Band-by-band formula
                </h3>
              </div>
              <ol className="space-y-3 p-4">
                {taxResult.breakdown.map((band, index) => (
                  <li
                    key={`${band.bandStart}-${band.bandEnd ?? 'max'}`}
                    className="text-sm break-all text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Band {index + 1}:
                    </span>{' '}
                    {formatCurrency(band.taxableAmount)} × {formatPercentage(band.taxRate * 100)} ={' '}
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(band.taxAmount)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </ModalPortal>

      {/* Tax Bands Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <img src={taxBandIcon} alt="Tax Bands icon" className="h-6 w-6 object-contain" />
          Current Tax Bands ({new Date().getFullYear()})
        </h3>
        <div className="grid gap-3">
          {taxBands.map((band, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <span className="font-semibold text-gray-900 break-all">
                {formatCurrency(band.bandStart)} -{' '}
                {band.bandEnd ? formatCurrency(band.bandEnd) : 'Above'}
              </span>
              <span className="font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-lg w-fit border border-blue-200">
                {formatPercentage(band.taxRate * 100)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaxCalculator
