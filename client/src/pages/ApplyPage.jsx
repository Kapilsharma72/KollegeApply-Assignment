import React, { useState } from 'react'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container" style={{ padding: '28px 0', maxWidth: 760 }}>
      <h1 style={{ margin: 0, fontSize: 'clamp(24px,3vw,36px)' }}>Start Your Application</h1>
      <p className="help" style={{ marginTop: 6 }}>This is a sample page to demonstrate navigation and responsiveness.</p>

      {!submitted ? (
        <form className="form" onSubmit={onSubmit} style={{ marginTop: 16 }}>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="input"><label>Full Name</label><input required placeholder="Your name" /></div>
            <div className="input"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
            <div className="input"><label>Phone</label><input required placeholder="10-digit" pattern="\\d{10}" /></div>
            <div className="input"><label>Preferred Course</label><input required placeholder="e.g., B.Tech CSE" /></div>
          </div>
          <div className="actions">
            <button className="btn" type="submit">Submit Application</button>
            <a className="btn ghost" href="/">Go Home</a>
          </div>
        </form>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Thank you!</h3>
          <p>We’ve received your sample application. Our counsellor will get in touch.</p>
          <div className="actions"><a className="btn" href="/">Back to Home</a></div>
        </div>
      )}
    </div>
  )
}
