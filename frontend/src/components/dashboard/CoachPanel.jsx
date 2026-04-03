import React, { useEffect, useRef, useState } from 'react';

const CoachPanel = ({ messages, onSend, quickPrompts, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const submitMessage = async (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || loading) return;
    setInputValue('');
    await onSend(trimmed);
  };

  return (
    <section className="glass-panel feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="feature-card-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 className="section-title">AI Career Coach</h2>
          <p className="section-caption" style={{ lineHeight: '1.6' }}>Ask follow-up questions about the score, skills, jobs, or rewrite.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`} style={{ padding: '12px 16px', borderRadius: '14px', lineHeight: '1.6' }}>
              <span>{message.content}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form style={{ display: 'flex', gap: '10px', alignItems: 'center' }} onSubmit={submitMessage}>
          <input
            type="text"
            className="chat-input"
            style={{ flex: 1 }}
            placeholder="Ask about the resume, job search, or skill gaps..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={loading}
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>

        {Array.isArray(quickPrompts) && quickPrompts.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-chip" onClick={() => onSend(prompt)} disabled={loading}
                style={{ padding: '8px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.18s ease' }}>
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CoachPanel;
