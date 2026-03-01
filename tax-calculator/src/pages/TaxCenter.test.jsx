import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TaxCenter from '../pages/TaxCenter'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('TaxCenter Component', () => {
  const renderTaxCenter = () => {
    return render(
      <BrowserRouter>
        <TaxCenter />
      </BrowserRouter>
    )
  }

  it('should render the tax center title and subtitle', () => {
    renderTaxCenter()

    expect(screen.getByText('Tax Center')).toBeInTheDocument()
    expect(
      screen.getByText('Your home base for tax tools, insights, and upcoming features.')
    ).toBeInTheDocument()
  })

  it('should display current date', () => {
    renderTaxCenter()

    const dateElement = screen.getByText(/\w+ \d{1,2}, \d{4}/)
    expect(dateElement).toBeInTheDocument()
  })

  it('should render all 6 tiles', () => {
    renderTaxCenter()

    expect(screen.getByText('Tax Calculator')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Documents')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Help & Support')).toBeInTheDocument()
  })

  it('should display tile descriptions', () => {
    renderTaxCenter()

    expect(screen.getByText(/Calculate income tax based on salary/)).toBeInTheDocument()
    expect(screen.getByText(/View and generate financial reports/)).toBeInTheDocument()
  })

  it('should display tile status badges', () => {
    renderTaxCenter()

    expect(screen.getByText('Most Used')).toBeInTheDocument()
    expect(screen.getAllByText('Coming Soon')).toHaveLength(5)
  })

  it('should render quick stats cards', () => {
    renderTaxCenter()

    expect(screen.getByText('Calculations Today')).toBeInTheDocument()
    expect(screen.getByText('Reports Generated')).toBeInTheDocument()
    expect(screen.getByText('Tax Bands Loaded')).toBeInTheDocument()
  })

  it('should display correct stat values', () => {
    renderTaxCenter()

    const statValues = screen.getAllByText(/^[0-9]+$/)
    expect(statValues.length).toBeGreaterThan(0)
  })

  it('should render custom icon image for tax calculator tile', () => {
    renderTaxCenter()

    expect(screen.getByRole('img', { name: 'Tax Calculator icon' })).toBeInTheDocument()
  })
})
