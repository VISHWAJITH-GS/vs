import React from 'react';
import SkillList from '../SkillList';
import ResumeOverview from './ResumeOverview';
import WorkflowPanel from './WorkflowPanel';

const OverviewPage = ({ workflowProps, parsedResume, resumeScore, skills, matchedSkills, missingSkills }) => {
  return (
    <div className="page-stack">
      <WorkflowPanel {...workflowProps} />
      <ResumeOverview
        parsedResume={parsedResume}
        resumeScore={resumeScore}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
      />
      <SkillList skills={skills} />
    </div>
  );
};

export default OverviewPage;
