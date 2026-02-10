export function generate30DayInsights() {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    return {
      day: `D${day}`,
      discipline: Math.round(65 + Math.sin(i / 4) * 18 + (i % 3) * 2),
      emotion: Math.round(50 + Math.cos(i / 3) * 20),
      pnl: Math.round((Math.sin(i / 5) * 140) + 40),
    }
  })
}
