// day-11-mockserver/src/components/InteractiveTesterPanel.jsx
import React, { useState } from 'react';
import { dispatchMockRequest } from '../mockEngine.js';

export function InteractiveTesterPanel({ routes, testUrl, testMethod, onToast }) {
  const [method, setMethod] = useState(testMethod || 'GET');
  const [url, setUrl] = useState(testUrl || '/api/v1/products');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const res = await dispatchMockRequest(routes, { method, url });
      setResponse(res);
      onToast(`Received ${res.status} ${res.statusText} in ${res.durationMs}ms`);
    } catch {
      onToast('Request dispatch failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="panel-card">
      <div className="panel-title">
        <span>Live Request Console</span>
        {response && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {response.durationMs}ms
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        <select
          className="input-control"
          style={{ width: '85px', padding: '0.4rem', fontSize: '0.75rem' }}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          className="input-control"
          style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/api/v1/..."
        />

        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>

      {response ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              background: response.status < 400 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 113, 133, 0.2)',
              color: response.status < 400 ? '#34d399' : '#fb7185',
              border: `1px solid ${response.status < 400 ? '#34d399' : '#fb7185'}`
            }}>
              {response.status} {response.statusText}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Latency: {response.durationMs}ms
            </span>
          </div>

          <pre
            className="code-editor"
            style={{ maxHeight: 'calc(100vh - 360px)', overflowY: 'auto', background: '#0a0512', fontSize: '0.75rem' }}
          >
            <code>{response.body}</code>
          </pre>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Hit Send to execute a simulated mock HTTP request.
        </div>
      )}
    </aside>
  );
}

export default InteractiveTesterPanel;
