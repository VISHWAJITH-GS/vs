import React from 'react'

const LandingSection = ({ id, eyebrow, title, subtitle, children }) => {
  return (
    <section id={id} className="landing-section glass-panel">
      <div className="landing-section-head">
        {eyebrow ? <span className="landing-eyebrow">{eyebrow}</span> : null}
        <h2 className="landing-title">{title}</h2>
        {subtitle ? <p className="landing-subtitle">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default LandingSection