import { generate30DayInsights } from './sampleData'

it('generates 30 days', () => {
  const data = generate30DayInsights()
  expect(data).toHaveLength(30)
  expect(data[0]).toHaveProperty('discipline')
})
