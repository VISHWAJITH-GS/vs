import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ATSScore = ({ matchedSkills, missingSkills }) => {
  if (!matchedSkills || !missingSkills) return null;
  
  const matchedLen = matchedSkills.length;
  const missingLen = missingSkills.length;
  const total = matchedLen + missingLen;
  
  const score = total === 0 ? 0 : Math.round((matchedLen / total) * 100);
  
  let pathColor = 'var(--error)';
  if (score >= 75) pathColor = 'var(--success)';
  else if (score >= 50) pathColor = 'var(--warning)';
  
  return (
    <div className="glass-panel h-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 className="section-title" style={{ alignSelf: 'flex-start', width: '100%' }}>Mock ATS Score</h2>
      
      <div style={{ width: '180px', height: '180px', margin: '20px 0' }}>
        <CircularProgressbar 
          value={score} 
          text={`${score} / 100`} 
          styles={buildStyles({
            textSize: '18px',
            pathColor: pathColor,
            textColor: 'var(--text-primary)',
            trailColor: 'rgba(255, 255, 255, 0.1)',
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
      
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
        Based on matched ({matchedLen}) vs missing ({missingLen}) skills for this role.
      </p>
    </div>
  );
};

export default ATSScore;
