import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'
import SectionCard from './SectionCard'

describe('UI polish primitives', () => {
  it('renders premium header badge and keeps hierarchy', () => {
    render(<PageHeader eyebrow="Control Room" title="Settings" subtitle="Manage your account" />)

    expect(screen.getByText('Control Room')).toHaveClass('badge')
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
  })

  it('renders section cards with standard shell classes', () => {
    render(<SectionCard title="Metrics">content</SectionCard>)

    const heading = screen.getByRole('heading', { level: 2, name: 'Metrics' })
    const section = heading.closest('section')

    expect(section).toHaveClass('card')
    expect(section).toHaveClass('page-section')
  })
})
