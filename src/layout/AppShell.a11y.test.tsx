import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AppShell from './AppShell'
import { StateProvider } from '../lib/state'

it('exposes navigation links with accessible labels', () => {
  render(
    <StateProvider>
      <MemoryRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="*" element={<div>content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </StateProvider>,
  )

  const links = screen.getAllByRole('link')
  expect(links.length).toBeGreaterThanOrEqual(7)
  expect(screen.getAllByRole('link', { name: /emergency/i }).length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByRole('link', { name: /settings/i }).length).toBeGreaterThanOrEqual(1)

  links.slice(0, 7).forEach((link) => {
    expect(link).toHaveClass('tap-target')
  })
})
