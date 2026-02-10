import { generate30DayInsights, getPatternAlerts } from './sampleData'

describe('sampleData', () => {
  it('generates 30 days', () => {
    const data = generate30DayInsights()
    expect(data).toHaveLength(30)
    expect(data[0]).toHaveProperty('discipline')
    expect(data[0]).toHaveProperty('adherence')
  })

  it('creates pattern alerts', () => {
    const alerts = getPatternAlerts(generate30DayInsights())
    expect(alerts.length).toBeGreaterThan(0)
    expect(alerts[0]).toHaveProperty('severity')
  })
})
