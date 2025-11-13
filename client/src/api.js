const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
const PD_DIRECT = import.meta.env.VITE_PIPEDREAM_DIRECT || ''

export async function getUniversities() {
  const res = await fetch(`${API_BASE}/api/universities`)
  if (!res.ok) throw new Error('Failed to load universities')
  return res.json()
}

export async function getFees(slug) {
  const res = await fetch(`${API_BASE}/api/fees/${slug}`)
  if (!res.ok) throw new Error('Failed to load fees')
  return res.json()
}

export async function submitLead(payload) {
  // If direct Pipedream URL is provided, hit that endpoint, otherwise use server
  if (PD_DIRECT) {
    const res = await fetch(PD_DIRECT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'kollegeapply-client', timestamp: new Date().toISOString(), lead: payload })
    })
    if (!res.ok) throw new Error('Failed to submit lead')
    return { ok: true, pipedreamForwarded: true }
  }
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Submission failed')
  }
  return res.json()
}
