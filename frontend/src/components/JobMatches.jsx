import React from 'react';

const JobMatches = ({ matches, onSelectJob, selectedJob }) => {
  if (!matches || matches.length === 0) return null;

  const getLinks = (match) => {
    if (Array.isArray(match?.platformLinks) && match.platformLinks.length) {
      return match.platformLinks;
    }

    if (match?.searchUrl) {
      return [{ platform: 'Search', url: match.searchUrl }];
    }

    return [];
  };

  return (
    <div className="glass-panel mt-8">
      <h2 className="section-title">Job Match Results</h2>
      <div className="grid-3">
        {matches.map((match, index) => {
          const isSelected = selectedJob === match.role;
          const links = getLinks(match);

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

              {match.description ? <p className="job-description">{match.description}</p> : null}

              {links.length ? (
                <div className="job-links">
                  {links.map((link, linkIndex) => (
                    <a
                      key={`${link.platform}-${linkIndex}`}
                      className="job-link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              ) : null}

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
