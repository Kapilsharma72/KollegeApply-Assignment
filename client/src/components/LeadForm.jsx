import React, { useState } from 'react'
import { submitLead } from '../api'

const initial = { fullName: '', email: '', phone: '', state: '', course: '', intakeYear: '', consent: false }

export default function LeadForm({ universitySlug, courses }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setErr('')
    setMsg('')
    try {
      const payload = { ...form, universitySlug }
      const res = await submitLead(payload)
      if (res.ok) {
        setMsg('Thanks! We have received your details.')
        setForm(initial)
      } else {
        setErr('Something went wrong. Please try again.')
      }
    } catch (e) {
      setErr(e.message || 'Submission failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="input"><label>Full Name</label><input name="fullName" value={form.fullName} onChange={handleChange} required /></div>
        <div className="input"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
        <div className="input"><label>Phone (10-digit, India)</label><input name="phone" value={form.phone} onChange={handleChange} pattern="\\d{10}" required /></div>
        <div className="input"><label>State</label><input name="state" value={form.state} onChange={handleChange} required /></div>
        <div className="input"><label>Course Interested</label>
          <select name="course" value={form.course} onChange={handleChange} required>
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="input"><label>Intake Year</label>
          <select name="intakeYear" value={form.intakeYear} onChange={handleChange} required>
            <option value="">Select year</option>
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() + i
              return <option key={y} value={String(y)}>{y}</option>
            })}
          </select>
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
        I agree to be contacted about admissions and brochures.
      </label>
      <div className="help">We respect your privacy.</div>

      {err && <div className="error">{err}</div>}
      {msg && <div className="success">{msg}</div>}

      <div className="actions">
        <button className="btn" disabled={busy} type="submit">{busy ? 'Submitting...' : 'Apply Now'}</button>
        <button className="btn ghost" type="reset" onClick={() => { setForm(initial); setErr(''); setMsg('') }}>Reset</button>
      </div>
    </form>
  )
}
