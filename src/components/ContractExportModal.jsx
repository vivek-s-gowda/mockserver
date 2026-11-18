// day-11-mockserver/src/components/ContractExportModal.jsx
import React, { useState } from 'react';
import { exportToOpenApi, exportToMsw, exportToExpress } from '../mockEngine.js';

export function ContractExportModal({ isOpen, onClose, routes, onToast }) {
  const [activeTab, setActiveTab] = useState('openapi'); // 'openapi' | 'msw' | 'express'
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  let codeOutput = '';
  let filename = '';
  let mimeType = 'text/plain';

  if (activeTab === 'openapi') {
    codeOutput = exportToOpenApi(routes);
    filename = 'openapi-spec.json';
    mimeType = 'application/json';
  } else if (activeTab === 'msw') {
    codeOutput = exportToMsw(routes);
    filename = 'mswHandlers.js';
    mimeType = 'text/javascript';
  } else if (activeTab === 'express') {
    codeOutput = exportToExpress(routes);
    filename = 'mockRouter.js';
    mimeType = 'text/javascript';
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeOutput);
      setCopySuccess(true);
      onToast(`Copied ${filename} to clipboard!`);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      onToast('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([codeOutput], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast(`Downloaded ${filename}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Export API Contracts & Handlers</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Export mock definitions for frontend development or testing
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose} style={{ fontSize: '1.25rem' }}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              className={`btn-ghost ${activeTab === 'openapi' ? 'btn-primary' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px' }}
              onClick={() => setActiveTab('openapi')}
            >
              OpenAPI 3.0 JSON
            </button>
            <button
              type="button"
              className={`btn-ghost ${activeTab === 'msw' ? 'btn-primary' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px' }}
              onClick={() => setActiveTab('msw')}
            >
              MSW 2.0 Handlers
            </button>
            <button
              type="button"
              className={`btn-ghost ${activeTab === 'express' ? 'btn-primary' : ''}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', borderRadius: '6px' }}
              onClick={() => setActiveTab('express')}
            >
              Express.js Router
            </button>
          </div>

          <pre className="code-editor" style={{ maxHeight: '320px', background: '#0a0512' }}>
            <code>{codeOutput}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleDownload}>
            Download {filename}
          </button>
          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            {copySuccess ? 'Copied! ✓' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContractExportModal;
