import React from 'react'
import LandingSection from './LandingSection'

const steps = [
  'Upload Resume',
  'AI Skill Extraction',
  'Job Matching',
  'Gap Analysis',
  'Career Insights Dashboard',
]

const HowItWorksSection = () => {
  return (
    <LandingSection
      id="how-it-works"
      eyebrow="Workflow"
      title="How It Works"
      subtitle="A clear pipeline from document upload to actionable career intelligence."
    >
      <div className="pipeline-flow">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="pipeline-step">
              <span>{step}</span>
            </div>
            {index < steps.length - 1 ? <div className="pipeline-arrow">→</div> : null}
          </React.Fragment>
        ))}
      </div>
    </LandingSection>
  )
}

export default HowItWorksSection