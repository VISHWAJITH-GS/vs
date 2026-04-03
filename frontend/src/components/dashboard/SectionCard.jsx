import React from 'react';

const SectionCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <section className={`glass-panel feature-card ${className}`.trim()}>
      <div className="feature-card-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 className="section-title">{title}</h2>
          {subtitle ? <p className="section-caption" style={{ lineHeight: '1.6' }}>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
