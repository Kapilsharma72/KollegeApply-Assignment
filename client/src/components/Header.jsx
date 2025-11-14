import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUniversities } from '../api'

export default function Header(){
  const [open, setOpen] = useState(false) // desktop dropdown
  const [drawer, setDrawer] = useState(false) // mobile drawer
  const [items, setItems] = useState([])
  const nav = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => { getUniversities().then(setItems).catch(() => {}) }, [])


  useEffect(() => {
    function onDoc(e){ if (!menuRef.current?.contains(e.target)) setOpen(false) }
    if (open) document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  function goApply(){ nav('/apply'); setDrawer(false) }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="KollegeApply home">KollegeApply</Link>

        {/* Desktop nav */}
        <nav className="nav nav-actions" aria-label="Main navigation">
          <div className="dropdown" ref={menuRef}>
            <button className="chip" onClick={() => setOpen(v=>!v)} aria-expanded={open} aria-haspopup="listbox">Colleges ▾</button>
            {open && (
              <div className="menu" role="listbox">
                {items.map(u => (
                  <button key={u.slug} className="menu-item" onClick={() => { setOpen(false); nav(`/u/${u.slug}`) }}>
                    <div className="title">{u.name}</div>
                    <div className="sub">{u.location}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a className="chip" href="tel:+919999999999">Call</a>
          <a className="chip" href="mailto:admissions@example.com">Email</a>
          <a className="chip" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp</a>
          <button className="btn secondary" onClick={goApply}>Apply</button>
        </nav>

        {/* Mobile hamburger */}
        <button className="hamburger" aria-label="Open menu" onClick={() => setDrawer(true)}>
          <span/>
          <span/>
          <span/>
        </button>
      </div>

      {/* Mobile drawer panel */}
      {drawer && (
        <div className="drawer" role="dialog" aria-modal="true" onClick={() => setDrawer(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setDrawer(false)}>✕</button>
            <h3>Explore</h3>
            <details className="collapsible" open>
              <summary>Colleges</summary>
              <div className="drawer-section">
                {items.map(u => (
                  <button key={u.slug} className="menu-item" onClick={() => { setDrawer(false); nav(`/u/${u.slug}`) }}>
                    <div className="title">{u.name}</div>
                    <div className="sub">{u.location}</div>
                  </button>
                ))}
              </div>
            </details>
            <div className="drawer-actions">
              <a className="chip" href="tel:+919999999999">Call</a>
              <a className="chip" href="mailto:admissions@example.com">Email</a>
              <a className="chip" href="https://wa.me/919999999999" target="_blank" rel="noreferrer">WhatsApp</a>
              <button className="btn secondary" onClick={goApply}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
