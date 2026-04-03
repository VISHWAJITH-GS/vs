import React from 'react'
import { Link } from 'react-router-dom'

const FinalCTASection = ({ onUploadClick, isAnalyzing }) => {
  return (
    <section className="final-cta glass-panel">
      <h2>Start Your Career Intelligence Journey</h2>
      <p>Upload your resume and turn static documents into a dynamic career growth system.</p>
      <div className="landing-hero-actions">
        <button className="btn primary" type="button" onClick={onUploadClick} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Upload Resume'}
        </button>
        <Link className="btn" to="/dashboard">
          Open Dashboard
        </Link>
      </div>
    </section>
  )
}

export default FinalCTASection