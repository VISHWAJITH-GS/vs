import React from 'react';

function formatDate(timestamp) {
  if (!timestamp) return 'Unknown';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function RevisionCard({ revision, active, onCompare, onRestore, onDelete }) {
  const score = revision?.analysis?.resumeScore?.overall ?? 0;
  const missingSkills = revision?.analysis?.skillGap?.missing?.length ?? 0;
  const jobMatches = revision?.analysis?.jobMatches?.length ?? 0;

  return (
    <article className={`revision-card ${active ? 'active' : ''}`}>
      <div className="revision-card-topline">
        <div>
          <strong>{revision.label}</strong>
          <p>{revision.targetRole || 'No target role'}</p>
        </div>
        <span className="revision-timestamp">{formatDate(revision.savedAt)}</span>
      </div>
      <div className="revision-metrics">
        <span>{score}/100 score</span>
        <span>{missingSkills} gaps</span>
        <span>{jobMatches} matches</span>
      </div>
      <div className="revision-actions">
        <button type="button" className="btn" onClick={() => onCompare(revision.id)}>
          {active ? 'Comparing' : 'Compare'}
        </button>
        <button type="button" className="btn primary" onClick={() => onRestore(revision.id)}>
          Restore
        </button>
        <button type="button" className="btn" onClick={() => onDelete(revision.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

function CompareSummary({ currentRevision, comparedRevision }) {
  if (!currentRevision || !comparedRevision) {
    return <p className="muted-text">Save at least one revision to compare it against the current draft.</p>;
  }

  const currentScore = currentRevision.analysis?.resumeScore?.overall ?? 0;
  const comparedScore = comparedRevision.analysis?.resumeScore?.overall ?? 0;
  const scoreDelta = currentScore - comparedScore;
  const currentMissing = currentRevision.analysis?.skillGap?.missing?.length ?? 0;
  const comparedMissing = comparedRevision.analysis?.skillGap?.missing?.length ?? 0;
  const currentSkills = currentRevision.analysis?.parsedResume?.skills?.length ?? 0;
  const comparedSkills = comparedRevision.analysis?.parsedResume?.skills?.length ?? 0;

  return (
    <div className="compare-summary">
      <div className="compare-summary-card">
        <span className="mini-label">Current draft</span>
        <strong>{currentRevision.label}</strong>
        <p>{currentScore}/100 score</p>
        <p>{currentSkills} skills, {currentMissing} gaps</p>
      </div>
      <div className="compare-summary-card">
        <span className="mini-label">Saved revision</span>
        <strong>{comparedRevision.label}</strong>
        <p>{comparedScore}/100 score</p>
        <p>{comparedSkills} skills, {comparedMissing} gaps</p>
      </div>
      <div className="compare-summary-card compare-highlight">
        <span className="mini-label">Score delta</span>
        <strong>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}</strong>
        <p>{Math.abs(currentMissing - comparedMissing)} gap change</p>
      </div>
    </div>
  );
}

const RevisionVault = ({
  revisions,
  currentRevision,
  compareRevisionId,
  onCompareRevisionChange,
  onSaveCurrent,
  canSaveCurrent,
  onRestoreRevision,
  onDeleteRevision,
}) => {
  const comparedRevision = revisions.find((revision) => revision.id === compareRevisionId) || null;

  return (
    <section className="glass-panel feature-card">
      <div className="feature-card-header">
        <div>
          <h2 className="section-title">Revision Vault</h2>
          <p className="section-caption">Save resume versions, restore a previous draft, and compare results side by side.</p>
        </div>
        <button type="button" className="btn primary" onClick={onSaveCurrent} disabled={!canSaveCurrent}>
          Save Current Revision
        </button>
      </div>

      <div className="revision-compare-toolbar">
        <label className="field-label" htmlFor="compare-revision">
          Compare against saved revision
        </label>
        <select
          id="compare-revision"
          className="target-input"
          value={compareRevisionId}
          onChange={(event) => onCompareRevisionChange(event.target.value)}
        >
          <option value="">Choose a saved revision</option>
          {revisions.map((revision) => (
            <option key={revision.id} value={revision.id}>
              {revision.label}
            </option>
          ))}
        </select>
      </div>

      <CompareSummary currentRevision={currentRevision} comparedRevision={comparedRevision} />

      <div className="revision-grid">
        {revisions.length ? (
          revisions.map((revision) => (
            <RevisionCard
              key={revision.id}
              revision={revision}
              active={revision.id === compareRevisionId}
              onCompare={onCompareRevisionChange}
              onRestore={onRestoreRevision}
              onDelete={onDeleteRevision}
            />
          ))
        ) : (
          <p className="muted-text">No revisions saved yet. Generate a report, then save the version you want to keep.</p>
        )}
      </div>
    </section>
  );
};

export default RevisionVault;
