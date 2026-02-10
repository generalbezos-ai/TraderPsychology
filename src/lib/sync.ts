import type { AppState } from './types'

export interface CloudAdapter {
  name: string
  upload: (payload: string) => Promise<string>
  download: () => Promise<string | null>
}

export const mockCloudAdapter: CloudAdapter = {
  name: 'Mock Drive',
  async upload(payload: string) {
    localStorage.setItem('traders-mind-mock-cloud', payload)
    return new Date().toISOString()
  },
  async download() {
    return localStorage.getItem('traders-mind-mock-cloud')
  },
}

export function serializeBackup(state: AppState): string {
  return JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2)
}

export function parseBackup(raw: string): AppState | null {
  try {
    const data = JSON.parse(raw) as { state?: AppState }
    return data.state ?? null
  } catch {
    return null
  }
}
