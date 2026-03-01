import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PlaceholderPage from '../pages/PlaceholderPage'

describe('PlaceholderPage Component', () => {
  it('should render title, icon, and description', () => {
    render(<PlaceholderPage title="Test Page" icon="🧪" description="This is a test description" />)

    expect(screen.getByText('Test Page')).toBeInTheDocument()
    expect(screen.getByText('🧪')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('should display "Coming Soon" badge', () => {
    render(<PlaceholderPage title="Future Feature" icon="🚀" description="Coming later" />)

    expect(screen.getByText('Coming Soon')).toBeInTheDocument()
  })

  it('should handle different icons', () => {
    const { rerender } = render(
      <PlaceholderPage title="Page 1" icon="📊" description="Description" />
    )

    expect(screen.getByText('📊')).toBeInTheDocument()

    rerender(<PlaceholderPage title="Page 2" icon="📈" description="Description" />)

    expect(screen.getByText('📈')).toBeInTheDocument()
  })

  it('should render icon image when iconImage is provided', () => {
    render(
      <PlaceholderPage
        title="Analytics"
        iconImage="/analytics-icon.png"
        description="Description"
      />
    )

    expect(screen.getByRole('img', { name: 'Analytics icon' })).toBeInTheDocument()
  })
})
