import React from 'react';

const SkillList = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="glass-panel mt-8">
      <h2 className="section-title">Extracted Skills</h2>
      <div className="tags-container">
        {skills.map((skill, index) => (
          <span key={index} className="tag blue">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillList;
