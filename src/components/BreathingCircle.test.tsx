import { render, screen } from '@testing-library/react'
import BreathingCircle from './BreathingCircle'

it('renders phase and seconds', () => {
  render(<BreathingCircle phase="Inhale" seconds={3} />)
  expect(screen.getByText('Inhale')).toBeInTheDocument()
  expect(screen.getByText('3')).toBeInTheDocument()
})

it('supports variant styling', () => {
  const { container } = render(<BreathingCircle phase="Stay" seconds={12} variant="emergency" />)
  expect(container.querySelector('.ring-fast')).toBeInTheDocument()
})
