import React from 'react';

const Suggestions = ({ suggestions, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel h-full" style={{ animation: 'pulse 1.5s infinite' }}>
        <h2 className="section-title">Generating AI Suggestions...</h2>
        <div className="gap-section">
          <div style={{ height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '75%' }}></div>
          <div style={{ height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '85%' }}></div>
          <div style={{ height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '65%' }}></div>
        </div>
      </div>
    );
  }

  if (!suggestions) return null;

  const suggestionList = Array.isArray(suggestions)
    ? suggestions.filter((s) => typeof s === 'string' && s.trim() !== '')
    : String(suggestions)
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s !== '');

  return (
    <div className="glass-panel h-full">
      <h2 className="section-title">AI Career Suggestions</h2>
      <ul className="suggestion-list">
        {suggestionList.map((suggestion, index) => (
          <li key={index} className="suggestion-item">
            <span className="icon-bullet">✧</span>
            <span>{suggestion.replace(/^[•*\-]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
