import { hashPin, isPinValid, verifyPin } from './security'

describe('security', () => {
  it('validates pin format', () => {
    expect(isPinValid('1234')).toBe(true)
    expect(isPinValid('12')).toBe(false)
  })

  it('verifies hash match', () => {
    const hash = hashPin('1234')
    expect(verifyPin('1234', hash)).toBe(true)
    expect(verifyPin('9999', hash)).toBe(false)
  })
})
