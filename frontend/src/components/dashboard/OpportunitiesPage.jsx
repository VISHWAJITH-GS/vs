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
}) => {
  return (
    <div className="page-stack">
      <JobMatches matches={jobMatches} onSelectJob={onSelectJob} selectedJob={selectedJob} />

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
