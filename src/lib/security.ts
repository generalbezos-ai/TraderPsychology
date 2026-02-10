export function hashPin(pin: string): string {
  let hash = 0
  for (let i = 0; i < pin.length; i += 1) {
    hash = (hash << 5) - hash + pin.charCodeAt(i)
    hash |= 0
  }
  return `pin:${Math.abs(hash)}`
}

export function isPinValid(pin: string): boolean {
  return /^\d{4,6}$/.test(pin)
}

export function verifyPin(pin: string, storedHash: string): boolean {
  if (!storedHash) return false
  return hashPin(pin) === storedHash
}
