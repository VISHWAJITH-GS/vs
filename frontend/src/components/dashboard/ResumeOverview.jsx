import React from 'react';
import ATSScore from '../ATSScore';

function joinList(items) {
  if (!Array.isArray(items) || items.length === 0) return 'None';
  return items.join(', ');
}

function WorkHistory({ parsedResume }) {
  const experience = Array.isArray(parsedResume?.experience) ? parsedResume.experience : [];
  const projects = Array.isArray(parsedResume?.projects) ? parsedResume.projects : [];

  return (
    <div className="grid-2">
      <div className="subpanel">
        <h3 className="subpanel-title">Experience</h3>
        {experience.length ? (
          <div className="stack-list">
            {experience.map((item, index) => (
              <article className="stack-item" key={`${item.company || 'exp'}-${index}`}>
                <strong>{item.role || 'Role'}</strong>
                <span>{item.company || 'Company'}</span>
                <p>{item.impact || 'No impact statement returned.'}</p>
                {item.dates ? <small>{item.dates}</small> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-text">No structured experience returned.</p>
        )}
      </div>

      <div className="subpanel">
        <h3 className="subpanel-title">Projects</h3>
        {projects.length ? (
          <div className="stack-list">
            {projects.map((item, index) => (
              <article className="stack-item" key={`${item.name || 'project'}-${index}`}>
                <strong>{item.name || 'Project'}</strong>
                <p>{item.impact || 'No project impact returned.'}</p>
                <small>{joinList(item.tech)}</small>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-text">No projects were extracted.</p>
        )}
      </div>
    </div>
  );
}

const ResumeOverview = ({ parsedResume, resumeScore, matchedSkills, missingSkills }) => {
  return (
    <div className="analysis-grid">
      <section className="glass-panel feature-card">
        <div className="feature-card-header">
          <div>
            <h2 className="section-title">Parsed Resume</h2>
            <p className="section-caption">Structured data extracted from the uploaded resume.</p>
          </div>
        </div>
        <div className="profile-summary">
          <div>
            <h3>{parsedResume.name || 'Unknown Candidate'}</h3>
            <p>{parsedResume.headline || 'Resume parsing will populate this area.'}</p>
          </div>
          <div className="profile-meta">
            <span>Education: {parsedResume.education.length}</span>
            <span>Experience: {parsedResume.experience.length}</span>
            <span>Projects: {parsedResume.projects.length}</span>
            <span>Certifications: {parsedResume.certifications.length}</span>
          </div>
        </div>
        <p className="summary-text">{parsedResume.summary || 'No summary returned yet.'}</p>
        <div className="stack-list compact-stack">
          <div>
            <strong>Education</strong>
            <p className="muted-text">{joinList(parsedResume.education)}</p>
          </div>
          <div>
            <strong>Certifications</strong>
            <p className="muted-text">{joinList(parsedResume.certifications)}</p>
          </div>
          <div>
            <strong>Portfolio links</strong>
            <p className="muted-text">{joinList(parsedResume.portfolioLinks)}</p>
          </div>
        </div>
        <div className="overview-history">
          <WorkHistory parsedResume={parsedResume} />
        </div>
      </section>

      <section className="glass-panel feature-card">
        <div className="feature-card-header">
          <div>
            <h2 className="section-title">Resume Quality Score</h2>
            <p className="section-caption">Score breakdown, strengths, and weaknesses.</p>
          </div>
        </div>
        <div className="score-layout">
          <ATSScore matchedSkills={matchedSkills} missingSkills={missingSkills} />
          <div className="score-breakdown">
            <div className="breakdown-row"><span>Skills</span><strong>{resumeScore.breakdown.skills}%</strong></div>
            <div className="breakdown-row"><span>Experience</span><strong>{resumeScore.breakdown.experience}%</strong></div>
            <div className="breakdown-row"><span>Projects</span><strong>{resumeScore.breakdown.projects}%</strong></div>
            <div className="breakdown-row"><span>Keywords</span><strong>{resumeScore.breakdown.keywordMatch}%</strong></div>
            <div className="breakdown-row"><span>Formatting</span><strong>{resumeScore.breakdown.formatting}%</strong></div>
            <div className="mini-section">
              <span className="mini-label">Strengths</span>
              <div className="tags-container">
                {resumeScore.strengths.map((item) => (
                  <span key={item} className="tag green">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mini-section">
              <span className="mini-label">Weaknesses</span>
              <div className="tags-container">
                {resumeScore.weaknesses.map((item) => (
                  <span key={item} className="tag red">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeOverview;
