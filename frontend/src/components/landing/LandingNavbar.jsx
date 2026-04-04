import React from 'react'
import { Link } from 'react-router-dom'

const LandingNavbar = () => {
  return (
    <nav className="landing-nav glass-panel">
      <Link to="/" className="landing-brand" aria-label="Resume to Role Intelligence home">
        <span className="brand-mark" />
        <span>Resume to Role Intelligence</span>
      </Link>

      <div className="landing-nav-links">
        <a href="#home" className="landing-link">Home</a>
        <a href="#features" className="landing-link">Features</a>
        <a href="#how-it-works" className="landing-link">How It Works</a>
        <Link to="/dashboard" className="landing-link">Dashboard</Link>
      </div>
    </nav>
  )
}

export default LandingNavbar