import React from 'react';

const RewritePanel = ({ rewrittenResume, onRewrite, loadingRewrite, hasRequestedRewrite }) => {
  if (!hasRequestedRewrite) {
    return (
      <section className="glass-panel feature-card">
        <div className="feature-card-header">
          <div>
            <h2 className="section-title">AI Resume Rewriter</h2>
            <p className="section-caption">Generate a clearer, more measurable, job-focused version of the resume.</p>
          </div>
          <button className="btn primary" onClick={onRewrite} disabled={loadingRewrite} type="button">
            {loadingRewrite ? 'Rewriting...' : 'Generate Rewrite'}
          </button>
        </div>
        <p className="muted-text">Rewrite panel stays closed until you request a rewrite.</p>
      </section>
    );
  }

  return (
    <section className="glass-panel feature-card">
      <div className="feature-card-header">
        <div>
          <h2 className="section-title">AI Resume Rewriter</h2>
          <p className="section-caption">Generate a clearer, more measurable, job-focused version of the resume.</p>
        </div>
        <button className="btn primary" onClick={onRewrite} disabled={loadingRewrite} type="button">
          {loadingRewrite ? 'Rewriting...' : 'Refresh Rewrite'}
        </button>
      </div>

      <div className="rewrite-grid">
        <div className="subpanel rewrite-preview">
          <p className="rewrite-summary">{rewrittenResume?.summary || 'No rewrite available yet.'}</p>
          {rewrittenResume?.headline ? <p className="rewrite-headline">{rewrittenResume.headline}</p> : null}
          <div className="rewrite-bullets">
            {Array.isArray(rewrittenResume?.bulletPoints) && rewrittenResume.bulletPoints.length ? (
              rewrittenResume.bulletPoints.map((bullet, index) => (
                <div className="suggestion-item" key={`${bullet}-${index}`}>
                  <span className="icon-bullet">✦</span>
                  <span>{bullet}</span>
                </div>
              ))
            ) : (
              <p className="muted-text">Request a rewrite to generate optimized bullet points.</p>
            )}
          </div>
        </div>

        <div className="subpanel">
          <h3 className="subpanel-title">Rewritten Text</h3>
          <pre className="rewrite-text">{rewrittenResume?.fullText || 'No rewritten text available yet.'}</pre>
        </div>
      </div>
    </section>
  );
};

export default RewritePanel;
