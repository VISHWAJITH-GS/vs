import React from 'react'
import LandingSection from './LandingSection'

const problems = [
  {
    title: 'ATS rejects good resumes',
    text: 'Qualified candidates are filtered out because formatting and keywords miss ATS expectations.',
  },
  {
    title: "Candidates don't know skill gaps",
    text: 'Most applicants never get a clear map of missing skills for target roles.',
  },
  {
    title: 'Job search is inefficient',
    text: 'People apply broadly without role-fit clarity, leading to low response rates and slower growth.',
  },
]

const ProblemSection = () => {
  return (
    <LandingSection
      id="features"
      eyebrow="Problem"
      title="Why Most Resumes Fail"
      subtitle="Traditional resume workflows are reactive, generic, and disconnected from job-market expectations."
    >
      <div className="landing-grid grid-3">
        {problems.map((item) => (
          <article key={item.title} className="landing-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </LandingSection>
  )
}

export default ProblemSection