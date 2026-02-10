export function haptic(pattern: 'light' | 'success' | 'warning' = 'light'): void {
  if (!('vibrate' in navigator)) return
  if (pattern === 'success') navigator.vibrate([12, 20, 12])
  else if (pattern === 'warning') navigator.vibrate([30, 30, 30])
  else navigator.vibrate(10)
}
