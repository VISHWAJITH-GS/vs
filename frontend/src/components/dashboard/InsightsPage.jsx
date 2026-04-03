import React from 'react';
import SectionCard from './SectionCard';
import SkillGap from '../SkillGap';
import SkillRadarChart from '../SkillRadarChart';
import Suggestions from '../Suggestions';

function MistakeList({ mistakes }) {
  if (!Array.isArray(mistakes) || mistakes.length === 0) return null;

  return (
    <div className="grid-2">
      {mistakes.map((mistake, index) => (
        <article className="mistake-card" key={`${mistake.title}-${index}`}>
          <div className="mistake-topline">
            <strong>{mistake.title}</strong>
            <span className={`severity severity-${mistake.severity || 'medium'}`}>{mistake.severity || 'medium'}</span>
          </div>
          <p>{mistake.detail}</p>
          <p className="mistake-fix"><strong>Fix:</strong> {mistake.fix}</p>
        </article>
      ))}
    </div>
  );
}

const InsightsPage = ({ mistakes, matchedSkills, missingSkills, suggestions, isAnalyzing }) => {
  return (
    <div className="page-stack">
      <div className="analysis-grid">
        <SectionCard title="Mistake Detection" subtitle="Missing achievements, weak phrasing, and formatting gaps.">
          <MistakeList mistakes={mistakes} />
          {!mistakes.length ? <p className="muted-text">Run analysis to see common resume issues.</p> : null}
        </SectionCard>

        <SkillGap matchedSkills={matchedSkills} missingSkills={missingSkills} />
      </div>

      <div className="analysis-grid">
        <SkillRadarChart matchedSkills={matchedSkills} missingSkills={missingSkills} />
        <Suggestions suggestions={suggestions} loading={isAnalyzing} />
      </div>
    </div>
  );
};

export default InsightsPage;
