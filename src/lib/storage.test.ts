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

  it('migrates partial old state safely', () => {
    localStorage.setItem('traders-mind-state', JSON.stringify({ profile: { name: 'Old' }, version: 1 }))
    const loaded = loadState()
    expect(loaded.profile.name).toBe('Old')
    expect(loaded.notifications.premarketReminder).toBe(true)
  })

  it('clears state', () => {
    saveState(defaultState)
    clearState()
    expect(loadState()).toEqual(defaultState)
  })
})
