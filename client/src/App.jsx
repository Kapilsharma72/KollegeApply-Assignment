import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import UniversityPage from './pages/UniversityPage'
import Home from './pages/Home'
import ApplyPage from './pages/ApplyPage'
import Header from './components/Header'

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/u/:slug" element={<UniversityPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} KollegeApply – assignment build</p>
        </div>
      </footer>
    </div>
  )
}
