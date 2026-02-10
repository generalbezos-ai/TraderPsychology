import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App routes', () => {
  it('renders home headline', async () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument()
  })

  it('redirects unknown routes to home', async () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument()
  })
})
