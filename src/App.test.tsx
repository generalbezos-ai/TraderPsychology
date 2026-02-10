import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

it('renders home headline', () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
})
