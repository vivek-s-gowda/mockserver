// day-11-mockserver/src/components/Header.jsx
import React from 'react';
import { THEMES } from '../themes.js';
import { SAMPLE_COLLECTIONS } from '../sampleCollections.js';

export function Header({
  activeTheme,
  onThemeChange,
  onLoadBlueprint,
  onOpenExportModal
}) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
          <div>
            <div className="brand-title">
              MockServer Studio
              <span className="brand-badge">API Simulator</span>
            </div>
            <p className="brand-tagline">Dynamic HTTP Mocking, Scenario Engine & OpenAPI 3.0 Studio</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Preset Blueprints */}
          <select
            className="input-control"
            style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onLoadBlueprint(e.target.value);
                e.target.value = '';
              }
            }}
            aria-label="Load API Blueprint"
          >
            <option value="" disabled>Load Blueprint...</option>
            {Object.values(SAMPLE_COLLECTIONS).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Export OpenAPI / MSW */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenExportModal}
            title="Export Contract Specs"
          >
            Export Contracts
          </button>

          {/* Theme Selector */}
          <select
            className="input-control"
            style={{ width: 'auto', padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            aria-label="Color Theme"
          >
            {Object.values(THEMES).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} {t.isPrimary ? '★' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
