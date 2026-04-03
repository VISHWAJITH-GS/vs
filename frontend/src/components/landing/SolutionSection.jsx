import React from 'react'
import LandingSection from './LandingSection'

const engines = [
  { icon: '◎', title: 'Resume Parsing', text: 'Extracts structure, achievements, projects, and skill signals from PDF/TXT files.' },
  { icon: '◉', title: 'Job Matching Engine', text: 'Ranks target roles by profile fit, market relevance, and transferable capability.' },
  { icon: '◌', title: 'Skill Gap Analysis', text: 'Identifies missing competencies and prioritizes which gaps matter most for growth.' },
  { icon: '✦', title: 'AI Career Coach', text: 'Provides contextual rewrite guidance, interview prep prompts, and next-step actions.' },
]

const SolutionSection = () => {
  return (
    <LandingSection
      id="solution"
      eyebrow="Solution"
      title="AI Career Intelligence Engine"
      subtitle="A modular platform that transforms static resumes into role-specific career strategy."
    >
      <div className="landing-grid grid-2">
        {engines.map((item) => (
          <article key={item.title} className="landing-card icon-card">
            <span className="landing-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </LandingSection>
  )
}

export default SolutionSection