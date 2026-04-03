import React from 'react';

const WorkflowPanel = ({
  uploadLabel,
  isAnalyzing,
  isRewriting,
  targetRole,
  onTargetRoleChange,
  editableResumeText,
  onResumeTextChange,
  onFileUpload,
  onAnalyze,
  onRewrite,
  onSaveRevision,
  canSaveRevision,
  error,
}) => {
  return (
    <section className="glass-panel editor-panel">
      <div className="editor-topline">
        <div>
          <h2 className="section-title">Interactive Resume Workflow</h2>
          <p className="section-caption">Edit the parsed text, re-run analysis, and compare how the score changes.</p>
        </div>
        <label className="upload-label upload-inline" htmlFor="resume-upload">
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf,.txt"
            onChange={onFileUpload}
            disabled={isAnalyzing}
            className="file-input"
          />
          {uploadLabel}
        </label>
      </div>

      <div className="workflow-toolbar">
        <input
          type="text"
          className="target-input"
          placeholder="Target role, e.g. Data Analyst, Product Manager, Software Engineer"
          value={targetRole}
          onChange={(event) => onTargetRoleChange(event.target.value)}
        />
        <button className="btn primary" type="button" onClick={onAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
        <button className="btn" type="button" onClick={onRewrite} disabled={isRewriting || isAnalyzing}>
          {isRewriting ? 'Rewriting...' : 'Rewrite Resume'}
        </button>
        <button className="btn" type="button" onClick={onSaveRevision} disabled={!canSaveRevision || isAnalyzing}>
          Save Revision
        </button>
      </div>

      <textarea
        className="resume-editor"
        value={editableResumeText}
        onChange={(event) => onResumeTextChange(event.target.value)}
        placeholder="Paste a resume here or upload a file to start analyzing..."
      />

      {isAnalyzing ? <p className="pulse-text text-center">Analyzing your resume and building the report...</p> : null}
      {error ? (
        <div className="error-msg">
          <strong>Error:</strong> {error}
        </div>
      ) : null}
    </section>
  );
};

export default WorkflowPanel;
