import React from 'react';

const JobMatches = ({ matches, onSelectJob, selectedJob }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="glass-panel mt-8">
      <h2 className="section-title">Job Match Results</h2>
      <div className="grid-3">
        {matches.map((match, index) => {
          const isSelected = selectedJob === match.role;
          return (
            <div 
              key={index} 
              className={`job-card ${isSelected ? 'active' : ''}`}
            >
              <h3 className="job-title">{match.role}</h3>
              <div className="flex-center">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${match.score}%` }}></div>
                </div>
                <span className="font-medium">{match.score}%</span>
              </div>
              <button 
                onClick={() => onSelectJob(match.role)}
                className={`btn ${isSelected ? 'primary' : ''}`}
                style={{ marginTop: 'auto' }}
              >
                {isSelected ? 'Analyzing Gap...' : 'Analyze Gap'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobMatches;
