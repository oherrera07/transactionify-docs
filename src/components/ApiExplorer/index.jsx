import React, { useState } from 'react';
import { ENDPOINTS } from './endpoints';
import { MethodBadge } from './components/MethodBadge';
import { EndpointPanel } from './components/EndpointPanel';
import { WelcomeScreen } from './components/WelcomeScreen';
import styles from './styles.module.css';

// ── ApiExplorer ───────────────────────────────────────────────────────────
// Root component for the API Explorer page.
// Manages two pieces of global state shared across the entire explorer:
//   - apiKey   — the API key entered in the top bar, passed to EndpointPanel
//   - selected — the index of the currently selected endpoint (null = none)
//
// Layout:
//   ┌─────────────────────────────────────────┐
//   │ API Key bar                             │
//   ├────────────┬────────────────────────────┤
//   │  Sidebar   │  Content area              │
//   │  (grouped  │  WelcomeScreen (no selection)│
//   │   endpoint │  EndpointPanel (selected)  │
//   │   list)    │                            │
//   └────────────┴────────────────────────────┘
export default function ApiExplorer() {
  const [apiKey,   setApiKey]   = useState('');   // Shared with all EndpointPanel instances
  const [selected, setSelected] = useState(null); // null = welcome screen, number = endpoint index

  // Group endpoints by their tag for sidebar section rendering
  // Result: { Accounts: [...], Payments: [...], ... }
  const groups = ENDPOINTS.reduce((acc, ep, i) => {
    (acc[ep.tag] = acc[ep.tag] || []).push({ ...ep, idx: i });
    return acc;
  }, {});

  return (
    <div className={styles.root}>

      {/* ── Global API key input bar ── */}
      {/* The key is passed down to EndpointPanel which uses it in the Authorization header */}
      <div className={styles.keyBar}>
        <span className={styles.keyLabel}>API KEY</span>
        <input
          type="text"
          className={styles.keyInput}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your APIKey here…"
          spellCheck={false}
          autoComplete="off"
        />
        {/* Display-only label showing the API base domain */}
        <span className={styles.baseUrl}>
          gj7edrv1il.execute-api.us-east-1.amazonaws.com
        </span>
      </div>

      <div className={styles.layout}>

        {/* ── Sidebar: grouped endpoint list ── */}
        <aside className={styles.sidebar}>
          {Object.entries(groups).map(([tag, eps]) => (
            <div key={tag} className={styles.sideGroup}>

              {/* Section label e.g. "Accounts", "Payments" */}
              <div className={styles.sideGroupLabel}>{tag}</div>

              {eps.map((ep) => (
                <button
                  key={ep.idx}
                  // Highlight the active endpoint with sideBtnActive
                  className={`${styles.sideBtn} ${selected === ep.idx ? styles.sideBtnActive : ''}`}
                  onClick={() => setSelected(ep.idx)}
                >
                  <MethodBadge method={ep.method} size="Sm" />
                  {/* Strip the /api/v1 prefix for a cleaner sidebar label */}
                  <span className={styles.sidePath}>
                    {ep.path.replace('/api/v1', '')}
                  </span>
                </button>
              ))}

            </div>
          ))}
        </aside>

        {/* ── Main content area ── */}
        <div className={styles.content}>
          {selected === null ? (
            // No endpoint selected — show the welcome screen with quick-access chips
            <WelcomeScreen endpoints={ENDPOINTS} onSelect={setSelected} />
          ) : (
            // Endpoint selected — render its detail panel
            // key={selected} forces a full remount when switching endpoints,
            // which resets all local state (inputs, response, loading) cleanly
            <EndpointPanel key={selected} ep={ENDPOINTS[selected]} apiKey={apiKey} />
          )}
        </div>

      </div>
    </div>
  );
}