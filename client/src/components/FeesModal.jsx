import React, { useEffect, useRef } from 'react'

export default function FeesModal({ open, onClose, data }) {
  const ref = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open && ref.current) {
      ref.current.querySelector('button, [href], input, select, textarea')?.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Course wise fees" onClick={(e) => e.stopPropagation()} ref={ref}>
        <header>
          <strong>Course-wise Fees – {data?.university}</strong>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </header>
        <div className="body">
          {data?.courses?.length ? (
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {data.courses.map((c) => (
                <div className="card" key={c.name}>
                  <h3>{c.name}</h3>
                  <div className="help">Duration: {c.duration}</div>
                  <div>Tuition / year: <strong>{data.currency} {c.feeRange.min.toLocaleString()} – {c.feeRange.max.toLocaleString()}</strong></div>
                  <div>Hostel / year: <strong>{data.currency} {c.hostelPerYear.toLocaleString()}</strong></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="help">No fee data available.</div>
          )}
        </div>
      </div>
    </div>
  )
}
