import React from 'react'
import LandingSection from './LandingSection'

const innovations = [
  'AI career coaching tailored to your role target and profile trajectory.',
  'Explainable job matching that shows why a role fits or misses.',
  'Skill gap roadmap with practical priorities and progression strategy.',
  'Personalized learning suggestions mapped to high-impact outcomes.',
]

const InnovationSection = () => {
  return (
    <LandingSection
      id="innovation"
      eyebrow="Innovation"
      title="Built For Smarter Career Decisions"
      subtitle="Beyond resume scoring: transparent reasoning, guided iteration, and strategic planning."
    >
      <div className="landing-grid grid-2">
        {innovations.map((item) => (
          <article key={item} className="landing-card innovation-card">
            <span className="landing-dot" />
            <p>{item}</p>
          </article>
        ))}
      </div>
    </LandingSection>
  )
}

export default InnovationSection