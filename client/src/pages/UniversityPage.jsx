import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUniversities, getFees } from '../api'
import LeadForm from '../components/LeadForm'
import FeesModal from '../components/FeesModal'

export default function UniversityPage() {
  const { slug } = useParams()
  const [uni, setUni] = useState(null)
  const [fees, setFees] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getUniversities().then((list) => {
      if (!mounted) return
      setUni(list.find((u) => u.slug === slug) || null)
    })
    return () => { mounted = false }
  }, [slug])

  const courseNames = useMemo(() => fees?.courses?.map((c) => c.name) || ['B.Tech', 'MBA', 'BBA', 'M.Tech', 'MCA'], [fees])

  function openFees() {
    setOpen(true)
    if (!fees) {
      getFees(slug).then(setFees).catch((e) => setError(e.message || 'Failed to fetch fees'))
    }
  }

  if (!uni) return <div className="container" style={{ padding: '24px 0' }}><p>Loading...</p></div>

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <section className="hero">
        <img src={uni.heroImage} alt="campus" />
        <div className="copy">
          <h1>{uni.name}</h1>
          <div className="help">{uni.location}</div>
          <p style={{ marginTop: 8 }}>{uni.tagline}</p>
          <div className="badges">{uni.highlights.map(h => <span key={h} className="badge">{h}</span>)}</div>
          <div className="actions">
            <button className="btn" onClick={openFees}>Check Course-wise Fees</button>
            <a className="btn secondary" href={uni.brochureUrl} target="_blank" rel="noreferrer">Download Brochure</a>
            <a className="btn ghost" href="#apply">Apply Now</a>
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="card"><h3>Overview</h3><p>Experience a vibrant campus life with industry-aligned curriculum, strong placement cell, and modern infrastructure.</p></div>
        <div className="card"><h3>Facilities</h3><ul>
          <li>Smart classrooms and labs</li>
          <li>Central library</li>
          <li>Hostel and sports complex</li>
        </ul></div>
        <div className="card"><h3>Placements</h3><p>100+ recruiters. Average package 7 LPA; highest 22 LPA.</p></div>
      </section>

      <section id="apply" style={{ marginTop: 24 }}>
        <div className="card">
          <h3>Apply Now</h3>
          <div className="help">Fill the lead form and we will contact you shortly.</div>
          <LeadForm universitySlug={slug} courses={courseNames} />
        </div>
      </section>

      <FeesModal open={open} onClose={() => setOpen(false)} data={fees} />
      {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  )
}
