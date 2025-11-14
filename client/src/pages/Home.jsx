import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getUniversities } from '../api'
import { resolveUniImage } from '../assets'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const gridRef = useRef(null)
  const loc = useLocation()
  const [q, setQ] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    getUniversities()
      .then(setItems)
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  // Get query from URL (?q=) which is controlled by Header
  useEffect(() => {
    const params = new URLSearchParams(loc.search)
    setQ((params.get('q') || '').trim())
  }, [loc.search])

  // Debounce update of URL as user types in the page search
  useEffect(() => {
    const id = setTimeout(() => {
      const next = q ? `/?q=${encodeURIComponent(q)}` : '/'
      if ((loc.pathname + loc.search) !== next) nav(next, { replace: false })
    }, 250)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const filtered = useMemo(() => {
    const debounced = q.toLowerCase()
    if (!debounced) return items
    return items.filter((u) => {
      const hay = [u.name, u.location, u.tagline, ...(u.highlights||[])].join(' ').toLowerCase()
      return hay.includes(debounced)
    })
  }, [items, q])

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div className="home-header">
        <div>
          <h1 style={{ marginBottom: 4 }}>Explore Private Universities</h1>
          <div className="help">Pick a university to view details and apply.</div>
        </div>
        <div className="search-pill">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-3.5-3.5" stroke="#5a3e2b" strokeWidth="1.6" strokeLinecap="round"/><circle cx="11" cy="11" r="7" stroke="#5a3e2b" strokeWidth="1.6" fill="none"/></svg>
          <input type="search" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search colleges..." aria-label="Search colleges" />
        </div>
      </div>

      <div className="help" style={{ marginTop: 8 }}>{q ? `Showing ${filtered.length} result(s) for "${q}"` : `Showing all ${items.length} universities`}</div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid" style={{ marginTop: 16 }} ref={gridRef}>
        {filtered.map((u) => (
          <div key={u.slug} className="card">
            <img src={resolveUniImage(u)} alt="campus" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
            <h3>{u.name}</h3>
            <div className="help">{u.location}</div>
            <p style={{ marginTop: 8 }}>{u.tagline}</p>
            <div className="badges">
              {u.highlights.map((h) => <span key={h} className="badge">{h}</span>)}
            </div>
            <div className="actions" style={{ marginTop: 12 }}>
              <Link className="btn" to={`/u/${u.slug}`}>View & Apply</Link>
            </div>
          </div>
        ))}
        {!loading && !error && filtered.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <strong>No matches</strong>
            <div className="help">Try another keyword or clear the search box.</div>
          </div>
        )}
      </div>
    </div>
  )
}
