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
    <section className="glass-panel feature-card">
      <div className="feature-card-header">
        <div>
          <h2 className="section-title">AI Career Coach</h2>
          <p className="section-caption">Ask follow-up questions about the score, skills, jobs, or rewrite.</p>
        </div>
      </div>

      <div className="coach-panel">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              <span>{message.content}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form className="chat-form" onSubmit={submitMessage}>
          <input
            type="text"
            className="chat-input"
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
          <div className="quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-chip" onClick={() => onSend(prompt)} disabled={loading}>
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
