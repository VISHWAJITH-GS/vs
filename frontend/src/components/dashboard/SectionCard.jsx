import React from 'react';

const SectionCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`glass-panel feature-card ${className}`.trim()}>
      <div className="feature-card-header">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-caption">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
