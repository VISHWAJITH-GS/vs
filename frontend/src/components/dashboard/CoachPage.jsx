import React from 'react';
import SectionCard from './SectionCard';
import RewritePanel from './RewritePanel';
import CoachPanel from './CoachPanel';

const CoachPage = ({ rewrittenResume, onRewrite, loadingRewrite, hasRequestedRewrite, messages, onSend, quickPrompts, loading }) => {
  return (
    <div className="page-stack">
      <RewritePanel
        rewrittenResume={rewrittenResume}
        onRewrite={onRewrite}
        loadingRewrite={loadingRewrite}
        hasRequestedRewrite={hasRequestedRewrite}
      />
      <CoachPanel messages={messages} onSend={onSend} quickPrompts={quickPrompts} loading={loading} />
      <SectionCard title="Job Search Integration" subtitle="Open live search queries for the best-fit roles.">
        <p className="section-caption">Use the Opportunities page for role match details, salary ranges, and saved revisions.</p>
      </SectionCard>
    </div>
  );
};

export default CoachPage;
