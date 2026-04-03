import React from 'react'

const fallbackRoles = ['Product Analyst', 'Data Analyst', 'Business Intelligence Associate']
const fallbackGaps = ['SQL optimization', 'stakeholder storytelling', 'A/B testing']

const HeroSection = ({ onUploadClick, onViewDemo, isAnalyzing, uploadLabel, analysis, error }) => {
  const score = analysis?.resumeScore?.overall || 74
  const roles = Array.isArray(analysis?.jobMatches) && analysis.jobMatches.length
    ? analysis.jobMatches.slice(0, 3).map((item) => item.role)
    : fallbackRoles
  const gaps = Array.isArray(analysis?.skillGap?.missing) && analysis.skillGap.missing.length
    ? analysis.skillGap.missing.slice(0, 3)
    : fallbackGaps

  return (
    <header className="landing-hero" id="hero">
      <div className="landing-hero-copy">
        <span className="landing-eyebrow">AI Career Intelligence Platform</span>
        <h1 className="landing-hero-title">Turn Your Resume Into Career Intelligence</h1>
        <p className="landing-subtitle">
          Resume to Role Intelligence parses your resume, maps it to real job opportunities, and explains
          exactly which skills to build next.
        </p>
        <div className="landing-hero-actions">
          <button className="btn primary" type="button" onClick={onUploadClick} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Upload Resume'}
          </button>
          <button className="btn" type="button" onClick={onViewDemo}>
            View Demo
          </button>
        </div>
        <p className="landing-upload-note">{uploadLabel}</p>
        {error ? <p className="landing-error">{error}</p> : null}
      </div>

      <article className="preview-card">
        <div className="preview-glow" />
        <div className="preview-score">
          <span>Resume Match Score</span>
          <strong>{score}/100</strong>
        </div>

        <div className="preview-block">
          <h3>Top Matching Roles</h3>
          <ul>
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>

        <div className="preview-block">
          <h3>Skill Gaps</h3>
          <div className="preview-tags">
            {gaps.map((gap) => (
              <span key={gap} className="tag red">{gap}</span>
            ))}
          </div>
        </div>
      </article>
    </header>
  )
}

export default HeroSection