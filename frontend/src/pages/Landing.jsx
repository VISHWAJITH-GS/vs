import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCareer } from '../context/CareerContext'

const Landing = () => {
  const navigate = useNavigate()
  const { uploadLabel, handleFileUpload, isAnalyzing, error } = useCareer()

  const handleLandingUpload = async (event) => {
    await handleFileUpload(event)
    navigate('/dashboard')
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="container hero-layout">
        <Navbar />
        <header className="hero-panel glass-panel">
          <div className="hero-copy">
            <p className="eyebrow">AI Career Intelligence Platform</p>
            <h1 className="glass-title">Resume to Role Intelligence</h1>
            <p className="glass-subtitle">
              Upload a resume, inspect the fit, and move into the dashboard to analyze gaps,
              opportunities, and coaching feedback.
            </p>
            <div>
              <label className="upload-label upload-inline" htmlFor="landing-resume-upload">
                <input
                  id="landing-resume-upload"
                  type="file"
                  accept="application/pdf,.txt"
                  onChange={handleLandingUpload}
                  disabled={isAnalyzing}
                  className="file-input"
                />
                {isAnalyzing ? 'Analyzing...' : uploadLabel}
              </label>
            </div>
            {error ? <p className="muted-text">{error}</p> : null}
          </div>

          <section className="glass-panel feature-card">
            <div className="feature-card-header">
              <div>
                <h2 className="section-title">Start Here</h2>
                <p className="section-caption">Upload a PDF or TXT resume and jump directly into your dashboard report.</p>
              </div>
            </div>
            <div className="subpanel">
              <p className="muted-text">
                Already have a draft? Continue from where you left off and open your stored analysis workflow.
              </p>
              <Link className="btn" to="/dashboard">
                Continue to Dashboard
              </Link>
            </div>
          </section>
        </header>
      </div>
    </div>
  )
}

export default Landing