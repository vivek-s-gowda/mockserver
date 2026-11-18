// day-11-mockserver/src/components/RouteListSidebar.jsx
import React, { useState } from 'react';

export function RouteListSidebar({
  routes,
  selectedRouteId,
  onSelectRoute,
  onAddRoute
}) {
  const [filter, setFilter] = useState('');

  const filteredRoutes = routes.filter((r) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return r.path.toLowerCase().includes(q) || (r.name && r.name.toLowerCase().includes(q)) || r.method.toLowerCase().includes(q);
  });

  return (
    <aside className="panel-card">
      <div className="panel-title">
        <span>Endpoints ({routes.length})</span>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          onClick={onAddRoute}
        >
          + Add Route
        </button>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          className="input-control"
          style={{ fontSize: '0.775rem', padding: '0.35rem 0.6rem' }}
          placeholder="Filter endpoints..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
        {filteredRoutes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
            No endpoints found.
          </p>
        ) : (
          filteredRoutes.map((r) => {
            const isSelected = r.id === selectedRouteId;
            return (
              <div
                key={r.id}
                className={`route-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectRoute(r.id)}
              >
                <span className={`method-badge method-${r.method}`}>
                  {r.method}
                </span>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div className="route-path" title={r.path}>
                    {r.path}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {r.status} OK • {r.latencyMs || 0}ms
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default RouteListSidebar;
