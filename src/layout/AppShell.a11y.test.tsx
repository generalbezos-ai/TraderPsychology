import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AppShell from './AppShell'

it('exposes navigation links with accessible labels', () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="*" element={<div>content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

  const links = screen.getAllByRole('link')
  expect(links.length).toBeGreaterThanOrEqual(7)
  expect(screen.getAllByRole('link', { name: /emergency/i }).length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByRole('link', { name: /settings/i }).length).toBeGreaterThanOrEqual(1)
})
