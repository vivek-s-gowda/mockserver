// day-11-mockserver/src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { SAMPLE_COLLECTIONS } from './sampleCollections.js';
import { THEMES, DEFAULT_THEME_ID } from './themes.js';

import { Header } from './components/Header.jsx';
import { RouteListSidebar } from './components/RouteListSidebar.jsx';
import { RouteEditorPanel } from './components/RouteEditorPanel.jsx';
import { InteractiveTesterPanel } from './components/InteractiveTesterPanel.jsx';
import { ContractExportModal } from './components/ContractExportModal.jsx';
import { Toast } from './components/Toast.jsx';

export function App() {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [routes, setRoutes] = useState(SAMPLE_COLLECTIONS.ecommerce.routes);
  const [selectedRouteId, setSelectedRouteId] = useState('rt-1');
  const [testUrl, setTestUrl] = useState('/api/v1/products');
  const [testMethod, setTestMethod] = useState('GET');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Apply Theme CSS variables
  useEffect(() => {
    const theme = THEMES[themeId] || THEMES[DEFAULT_THEME_ID];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--bg', theme.colors.bg);
    root.style.setProperty('--card', theme.colors.card);
    root.style.setProperty('--card-hover', theme.colors.cardHover);
    root.style.setProperty('--border', theme.colors.border);
    root.style.setProperty('--text', theme.colors.text);
    root.style.setProperty('--text-muted', theme.colors.textMuted);
    root.style.setProperty('--badge', theme.colors.badge);
    root.style.setProperty('--glow', theme.colors.glow);
  }, [themeId]);

  // Handle URL hash changes for snapshot capture
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#workflow') {
        setSelectedRouteId('rt-2');
        setTestUrl('/api/v1/products/prod_02');
        setTestMethod('GET');
        setIsExportModalOpen(false);
      } else if (hash === '#deepdive') {
        setSelectedRouteId('rt-3');
        setTestUrl('/api/v1/checkout');
        setTestMethod('POST');
        setIsExportModalOpen(false);
      } else if (hash === '#export') {
        setIsExportModalOpen(true);
      } else if (hash === '#overview' || !hash) {
        setIsExportModalOpen(false);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const handleUpdateRoute = (id, field, value) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRoute = (id) => {
    const remaining = routes.filter((r) => r.id !== id);
    setRoutes(remaining);
    if (selectedRouteId === id && remaining.length > 0) {
      setSelectedRouteId(remaining[0].id);
    }
    addToast('Endpoint deleted');
  };

  const handleAddRoute = () => {
    const newRoute = {
      id: `rt-${Date.now()}`,
      name: 'New Custom Endpoint',
      method: 'GET',
      path: `/api/v1/custom/${Date.now().toString(36)}`,
      status: 200,
      latencyMs: 50,
      responseBody: JSON.stringify({ message: 'Hello from MockServer', timestamp: '{{faker.date}}' }, null, 2)
    };
    setRoutes((prev) => [...prev, newRoute]);
    setSelectedRouteId(newRoute.id);
    addToast('Created new mock endpoint');
  };

  const handleLoadBlueprint = (blueprintKey) => {
    const bp = SAMPLE_COLLECTIONS[blueprintKey];
    if (bp) {
      setRoutes(bp.routes);
      if (bp.routes.length > 0) {
        setSelectedRouteId(bp.routes[0].id);
        setTestUrl(bp.routes[0].path.replace(/:([a-zA-Z0-9_]+)/g, 'item_123'));
        setTestMethod(bp.routes[0].method);
      }
      addToast(`Loaded ${bp.name} blueprint`);
    }
  };

  const handleTestRoute = (route) => {
    setTestUrl(route.path.replace(/:([a-zA-Z0-9_]+)/g, 'item_42'));
    setTestMethod(route.method);
    addToast(`Loaded ${route.method} ${route.path} into test console`);
  };

  return (
    <div className="app-container">
      <Header
        activeTheme={themeId}
        onThemeChange={setThemeId}
        onLoadBlueprint={handleLoadBlueprint}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <main className="main-content">
        <div className="workspace-columns">
          <RouteListSidebar
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => {
              setSelectedRouteId(id);
              const r = routes.find((item) => item.id === id);
              if (r) {
                setTestUrl(r.path.replace(/:([a-zA-Z0-9_]+)/g, '42'));
                setTestMethod(r.method);
              }
            }}
            onAddRoute={handleAddRoute}
          />

          <RouteEditorPanel
            route={selectedRoute}
            onUpdateRoute={handleUpdateRoute}
            onDeleteRoute={handleDeleteRoute}
            onTestRoute={handleTestRoute}
          />

          <InteractiveTesterPanel
            routes={routes}
            testUrl={testUrl}
            testMethod={testMethod}
            onToast={addToast}
          />
        </div>
      </main>

      <ContractExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        routes={routes}
        onToast={addToast}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
