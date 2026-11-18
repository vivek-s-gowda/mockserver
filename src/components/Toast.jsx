// day-11-mockserver/src/components/Toast.jsx
import React from 'react';

export function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default Toast;
