// src/services/tracker.ts
export type TrackerStatus = {
  is_tracking: boolean
  interval: number
}

export const trackerApi = {
  async getStatus(): Promise<TrackerStatus> {
    const res = await fetch('/api/tracker/status')
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  },

  async start() {
    const res = await fetch('/api/tracker/start', { method: 'POST' })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  },

  async stop() {
    const res = await fetch('/api/tracker/stop', { method: 'POST' })
    if (!res.ok) throw new Error(res.statusText)
    return res.json()
  }
}