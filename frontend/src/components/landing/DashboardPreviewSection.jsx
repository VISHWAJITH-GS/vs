import React from 'react'
import LandingSection from './LandingSection'

const DashboardPreviewSection = () => {
  return (
    <LandingSection
      id="dashboard-preview"
      eyebrow="Product"
      title="Career Insights Dashboard"
      subtitle="Track role fit, close capability gaps, and iterate resume quality in one workspace."
    >
      <div className="landing-grid grid-2">
        <article className="landing-card preview-mini">
          <h3>Match Score Chart</h3>
          <div className="mini-bars">
            <span style={{ width: '84%' }} />
            <span style={{ width: '68%' }} />
            <span style={{ width: '73%' }} />
          </div>
        </article>

        <article className="landing-card preview-mini">
          <h3>Skill Gap Radar</h3>
          <div className="radar-placeholder" />
        </article>

        <article className="landing-card preview-mini">
          <h3>Job Recommendations</h3>
          <ul className="preview-list">
            <li>Data Analyst - 82% match</li>
            <li>Product Analyst - 78% match</li>
            <li>Growth Analyst - 74% match</li>
          </ul>
        </article>

        <article className="landing-card preview-mini">
          <h3>AI Resume Feedback</h3>
          <p>"Quantify project impact and align summary keywords with target role requirements."</p>
        </article>
      </div>
    </LandingSection>
  )
}

export default DashboardPreviewSection