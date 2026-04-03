import React from 'react';

const SkillGap = ({ matchedSkills, missingSkills }) => {
  return (
    <div className="glass-panel h-full gap-section">
      <h2 className="section-title">Skill Gap Analysis</h2>
      
      <div>
        <h3 className="glass-subtitle mb-6" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Matched Skills</h3>
        {matchedSkills && matchedSkills.length > 0 ? (
          <div className="tags-container">
            {matchedSkills.map((skill, index) => (
              <span key={index} className="tag green">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No matched skills found.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="glass-subtitle mb-6" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Missing Skills</h3>
        {missingSkills && missingSkills.length > 0 ? (
          <div className="tags-container">
            {missingSkills.map((skill, index) => (
              <span key={index} className="tag red">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No missing skills! You're a perfect match.</p>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
