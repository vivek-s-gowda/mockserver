// day-11-mockserver/src/components/RouteEditorPanel.jsx
import React from 'react';

export function RouteEditorPanel({
  route,
  onUpdateRoute,
  onDeleteRoute,
  onTestRoute
}) {
  if (!route) {
    return (
      <div className="panel-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select an endpoint from the left sidebar or click "+ Add Route" to configure mock behavior.
        </p>
      </div>
    );
  }

  const FAKER_TOKENS = [
    { label: 'Name', token: '{{faker.name}}' },
    { label: 'Email', token: '{{faker.email}}' },
    { label: 'UUID', token: '{{faker.uuid}}' },
    { label: 'Date', token: '{{faker.date}}' },
    { label: 'Company', token: '{{faker.company}}' },
    { label: 'City', token: '{{faker.city}}' },
    { label: 'Param ID', token: '{{param.id}}' }
  ];

  const insertToken = (token) => {
    const current = route.responseBody || '';
    onUpdateRoute(route.id, 'responseBody', current + token);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Endpoint Configuration</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            onClick={() => onTestRoute(route)}
          >
            ⚡ Test in Console
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ fontSize: '0.75rem', color: '#fb7185', padding: '0.25rem 0.5rem' }}
            onClick={() => onDeleteRoute(route.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Method
          </label>
          <select
            className="input-control"
            value={route.method}
            onChange={(e) => onUpdateRoute(route.id, 'method', e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Path (supports :params)
          </label>
          <input
            type="text"
            className="input-control"
            style={{ fontFamily: 'monospace' }}
            value={route.path}
            onChange={(e) => onUpdateRoute(route.id, 'path', e.target.value)}
            placeholder="/api/v1/resource/:id"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
            Status Code
          </label>
          <select
            className="input-control"
            value={route.status}
            onChange={(e) => onUpdateRoute(route.id, 'status', Number(e.target.value))}
          >
            <option value="200">200 OK</option>
            <option value="201">201 Created</option>
            <option value="204">204 No Content</option>
            <option value="400">400 Bad Request</option>
            <option value="401">401 Unauthorized</option>
            <option value="403">403 Forbidden</option>
            <option value="404">404 Not Found</option>
            <option value="422">422 Unprocessable</option>
            <option value="500">500 Server Error</option>
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
            <span>Simulated Latency</span>
            <strong style={{ color: 'var(--primary)' }}>{route.latencyMs || 0} ms</strong>
          </div>
          <input
            type="range"
            min="0"
            max="1200"
            step="25"
            value={route.latencyMs || 0}
            onChange={(e) => onUpdateRoute(route.id, 'latencyMs', Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* Faker Tokens Helper */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          Insert Dynamic Faker Tokens:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {FAKER_TOKENS.map((ft) => (
            <button
              key={ft.token}
              type="button"
              className="btn-ghost"
              style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.45rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border)',
                borderRadius: '4px'
              }}
              onClick={() => insertToken(ft.token)}
              title={`Append ${ft.token}`}
            >
              + {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* JSON Editor */}
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
          Response Body (JSON Template)
        </label>
        <textarea
          rows="12"
          className="code-editor"
          value={route.responseBody || ''}
          onChange={(e) => onUpdateRoute(route.id, 'responseBody', e.target.value)}
          placeholder="{ ... }"
        />
      </div>
    </div>
  );
}

export default RouteEditorPanel;
