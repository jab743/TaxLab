import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'

describe('Layout Component', () => {
  const renderLayout = (children = <div>Test Content</div>) => {
    return render(
      <BrowserRouter>
        <Layout>{children}</Layout>
      </BrowserRouter>
    )
  }

  it('should render header with portal title', () => {
    renderLayout()

    expect(screen.getByText('TaxLab Portal')).toBeInTheDocument()
  })

  it('should display user information', () => {
    renderLayout()

    expect(screen.getByText('Demo User')).toBeInTheDocument()
    expect(screen.getByText('DU')).toBeInTheDocument()
  })

  it('should render navigation items', () => {
    renderLayout()

    expect(screen.getByText('Tax Center')).toBeInTheDocument()
    expect(screen.getByText('Tax Calculator')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should render navigation icons', () => {
    renderLayout()

    const nav = screen.getByText('Tax Center').closest('nav')
    expect(nav).toHaveTextContent('📈')
    expect(nav).toHaveTextContent('⚙️')
    expect(screen.getByRole('img', { name: 'Tax Center icon' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Tax Calculator icon' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Analytics icon' })).toBeInTheDocument()
  })

  it('should render children content', () => {
    renderLayout(<div>Custom Child Content</div>)

    expect(screen.getByText('Custom Child Content')).toBeInTheDocument()
  })

  it('should have navigation links with correct paths', () => {
    renderLayout()

    const taxCenterLink = screen.getByText('Tax Center').closest('a')
    expect(taxCenterLink).toHaveAttribute('href', '/')

    const taxCalcLink = screen.getByText('Tax Calculator').closest('a')
    expect(taxCalcLink).toHaveAttribute('href', '/tax-calculator')
  })

  it('should apply active class to current route', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test</div>
        </Layout>
      </BrowserRouter>
    )

    const taxCenterLink = screen.getByText('Tax Center').closest('a')
    // Should have active styling classes
    expect(taxCenterLink.className).toContain('text-blue-700')
  })
})
