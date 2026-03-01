import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaxCalculator from '../pages/TaxCalculator'

// Mock fetch
globalThis.fetch = vi.fn()

const mockTaxBands = [
  { bandStart: 0, bandEnd: 14000, taxRate: 0.115 },
  { bandStart: 14000, bandEnd: 48000, taxRate: 0.21 },
  { bandStart: 48000, bandEnd: 70000, taxRate: 0.315 },
  { bandStart: 70000, bandEnd: null, taxRate: 0.355 },
]

describe('TaxCalculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockTaxBands,
    })
  })

  it('should show loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}))
    render(<TaxCalculator />)
    expect(screen.getByText('Loading tax bands...')).toBeInTheDocument()
  })

  it('should load and display tax calculator after fetching bands', async () => {
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByText('Income Tax Calculator')).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
  })

  it('should display error message when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    })

    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Tax Bands/i)).toBeInTheDocument()
      expect(screen.getByText(/Failed to fetch tax bands/i)).toBeInTheDocument()
    })
  })

  it('should display current tax bands', async () => {
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByText(/Current Tax Bands/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/\$0\.00 - \$14,000\.00/)).toBeInTheDocument()
    expect(screen.getByText(/\$14,000\.00 - \$48,000\.00/)).toBeInTheDocument()
  })

  it('should accept numeric input in salary field', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    expect(input).toHaveValue('50,000')
  })

  it('should reject non-numeric input', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, 'abc')

    expect(input).toHaveValue('')
  })

  it('should allow decimal input', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000.50')

    expect(input).toHaveValue('50,000.50')
  })

  it('should format large numbers with commas while typing', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '123456789')

    expect(input).toHaveValue('123,456,789')
  })

  it('should calculate and display tax results when salary is entered', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    await waitFor(() => {
      expect(screen.getByText('Gross Income')).toBeInTheDocument()
      expect(screen.getByText('Total Tax')).toBeInTheDocument()
      expect(screen.getByText('Net Income')).toBeInTheDocument()
    })
  })

  it('should display tax breakdown by band', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '60000')

    await waitFor(() => {
      expect(screen.getByText('Tax Breakdown by Band')).toBeInTheDocument()
    })
  })

  it('should show clear button when salary is entered', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()

    await user.type(input, '50000')

    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('should clear input and results when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    await waitFor(() => {
      expect(screen.getByText('Gross Income')).toBeInTheDocument()
    })

    const clearButton = screen.getByLabelText('Clear')
    await user.click(clearButton)

    expect(input).toHaveValue('')
    expect(screen.queryByText('Gross Income')).not.toBeInTheDocument()
  })

  it('should display effective tax rate', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    await waitFor(() => {
      expect(screen.getByText(/Rate:/i)).toBeInTheDocument()
    })
  })

  it('should update results when salary changes', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '30000')

    await waitFor(() => {
      expect(screen.getByText('Gross Income')).toBeInTheDocument()
    })

    await user.clear(input)
    await user.type(input, '60000')

    // Results should update with new calculation
    await waitFor(() => {
      expect(screen.getByText('Gross Income')).toBeInTheDocument()
    })
  })

  it('should not display results for zero salary', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '0')

    expect(screen.queryByText('Gross Income')).not.toBeInTheDocument()
  })

  it('should format currency values correctly', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    await waitFor(() => {
      expect(screen.getByText('$50,000.00')).toBeInTheDocument()
    })
  })

  it('should open and close calculation details modal rendered through a portal', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Annual Salary/i)).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText(/Annual Salary/i), '50000')

    const openButton = await screen.findByRole('button', { name: /View calculation details/i })
    await user.click(openButton)

    expect(screen.getByRole('dialog', { name: /Calculation Details/i })).toBeInTheDocument()
    expect(screen.getByText(/Band-by-band formula/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Close$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Calculation Details/i })).not.toBeInTheDocument()
    })
  })

  it('should expose invalid semantics for a zero salary value', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    const input = await screen.findByLabelText(/Annual Salary/i)
    await user.type(input, '0')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/Please enter a valid amount greater than 0/i)).toBeInTheDocument()
  })

  it('should close the portal modal when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator />)

    const input = await screen.findByLabelText(/Annual Salary/i)
    await user.type(input, '50000')

    await user.click(await screen.findByRole('button', { name: /View calculation details/i }))
    expect(screen.getByRole('dialog', { name: /Calculation Details/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Calculation Details/i })).not.toBeInTheDocument()
    })
  })
})
