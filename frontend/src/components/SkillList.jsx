import React from 'react';

const SkillList = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px', overflow: 'hidden', boxSizing: 'border-box' }}>
      <h2 className="section-title" style={{ marginBottom: '20px' }}>Extracted Skills</h2>
      <div className="tags-container" style={{ flexWrap: 'wrap', overflowWrap: 'break-word' }}>
        {skills.map((skill, index) => (
          <span key={index} className="tag blue" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
