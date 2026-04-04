import React from 'react';

const SkillGap = ({ matchedSkills, missingSkills }) => {
  return (
    <div className="glass-panel h-full" style={{ padding: '24px', overflow: 'hidden', boxSizing: 'border-box' }}>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>Skill Gap Analysis</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--accent-primary)',
          marginBottom: '10px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Matched Skills
        </h3>
        {matchedSkills && matchedSkills.length > 0 ? (
          <div className="tags-container" style={{ flexWrap: 'wrap', overflowWrap: 'break-word' }}>
            {matchedSkills.map((skill, index) => (
              <span key={index} className="tag green" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>No matched skills found.</p>
        )}
      </div>

      <div>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--accent-warm)',
          marginBottom: '10px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Missing Skills
        </h3>
        {missingSkills && missingSkills.length > 0 ? (
          <div className="tags-container" style={{ flexWrap: 'wrap', overflowWrap: 'break-word' }}>
            {missingSkills.map((skill, index) => (
              <span key={index} className="tag red" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>No missing skills! You're a perfect match.</p>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
