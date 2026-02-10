import { clearState, defaultState, loadState, saveState } from './storage'

describe('storage', () => {
  beforeEach(() => localStorage.clear())
  it('loads default state', () => {
    expect(loadState()).toEqual(defaultState)
  })
  it('saves and loads state', () => {
    const next = { ...defaultState, streak: 4 }
    saveState(next)
    expect(loadState().streak).toBe(4)
  })
  it('clears state', () => {
    saveState(defaultState)
    clearState()
    expect(loadState()).toEqual(defaultState)
  })
})
