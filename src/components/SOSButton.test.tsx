import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SOSButton from './SOSButton'

describe('SOSButton', () => {
  it('toggles emergency quick actions dialog', () => {
    render(
      <MemoryRouter>
        <SOSButton />
      </MemoryRouter>,
    )

    const trigger = screen.getByRole('button', { name: /toggle emergency quick actions/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: /emergency quick actions/i })).toBeInTheDocument()
  })
})
