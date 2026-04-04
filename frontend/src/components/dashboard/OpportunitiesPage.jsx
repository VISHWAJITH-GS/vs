import React from 'react';
import SectionCard from './SectionCard';
import JobMatches from '../JobMatches';

function SalaryInsights({ insights }) {
  if (!Array.isArray(insights) || insights.length === 0) return null;

  return (
    <div className="grid-2">
      {insights.map((insight, index) => (
        <article className="salary-card" key={`${insight.role}-${index}`}>
          <div className="salary-header">
            <strong>{insight.role}</strong>
            <span>{insight.range}</span>
          </div>
          <p>{insight.notes}</p>
          <div className="salary-meta">
            <span>{insight.experienceLevel}</span>
            <span>{insight.marketTrend}</span>
            <span>{insight.currency}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function Recommendations({ recommendations }) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) return null;

  return (
    <div className="grid-2">
      {recommendations.map((item, index) => (
        <article className="recommendation-card" key={`${item.role}-${index}`}>
          <div className="recommendation-header">
            <strong>{item.role}</strong>
            <span>{item.fitScore}% fit</span>
          </div>
          <p>{item.why}</p>
          <div className="mini-section">
            <span className="mini-label">Next steps</span>
            <div className="tags-container">
              {item.nextSteps.map((step, stepIndex) => (
                <span key={`${step}-${stepIndex}`} className="tag green">
                  {step}
                </span>
              ))}
            </div>
          </div>
          <div className="mini-section">
            <span className="mini-label">Growth areas</span>
            <div className="tags-container">
              {item.growthAreas.map((growthArea, growthIndex) => (
                <span key={`${growthArea}-${growthIndex}`} className="tag red">
                  {growthArea}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

const OpportunitiesPage = ({
  jobMatches,
  selectedJob,
  onSelectJob,
  salaryInsights,
  careerRecommendations,
  analysis,
}) => {
  const positives = [
    ...(Array.isArray(analysis?.resumeScore?.strengths) ? analysis.resumeScore.strengths : []),
    ...(Array.isArray(analysis?.skillGap?.matched) ? analysis.skillGap.matched : []),
  ].filter(Boolean)

  const negatives = [
    ...(Array.isArray(analysis?.resumeScore?.weaknesses) ? analysis.resumeScore.weaknesses : []),
    ...(Array.isArray(analysis?.skillGap?.missing) ? analysis.skillGap.missing : []),
  ].filter(Boolean)

  const improvements = Array.isArray(analysis?.suggestions) ? analysis.suggestions.filter(Boolean) : []

  return (
    <div className="page-stack">
      <JobMatches matches={jobMatches} onSelectJob={onSelectJob} selectedJob={selectedJob} />

      {selectedJob ? (
        <SectionCard
          title={`Gap Analysis: ${selectedJob}`}
          subtitle="Role-specific positives, negatives, and practical steps to close missing skill gaps."
        >
          <div className="analysis-grid">
            <article className="recommendation-card">
              <div className="recommendation-header">
                <strong>Positives</strong>
                <span>{positives.length}</span>
              </div>
              <div className="tags-container">
                {positives.length ? (
                  positives.map((item, index) => (
                    <span className="tag green" key={`${item}-${index}`}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p>No clear strengths identified yet for this role.</p>
                )}
              </div>
            </article>

            <article className="recommendation-card">
              <div className="recommendation-header">
                <strong>Negatives</strong>
                <span>{negatives.length}</span>
              </div>
              <div className="tags-container">
                {negatives.length ? (
                  negatives.map((item, index) => (
                    <span className="tag red" key={`${item}-${index}`}>
                      {item}
                    </span>
                  ))
                ) : (
                  <p>No major negatives detected for this role.</p>
                )}
              </div>
            </article>
          </div>

          <div className="mini-section" style={{ marginTop: '1rem' }}>
            <span className="mini-label">How to improve missing skills</span>
            <div className="tags-container">
              {improvements.length ? (
                improvements.map((tip, index) => (
                  <span className="tag" key={`${tip}-${index}`}>
                    {tip}
                  </span>
                ))
              ) : (
                <p>Analyze this role again to get specific improvement suggestions.</p>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}

      <div className="analysis-grid">
        <SectionCard title="Salary Insights" subtitle="Estimated compensation ranges and market signals for relevant roles.">
          <SalaryInsights insights={salaryInsights} />
        </SectionCard>

        <SectionCard title="Career Recommendations" subtitle="Roles and paths that fit the current profile.">
          <Recommendations recommendations={careerRecommendations} />
        </SectionCard>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
