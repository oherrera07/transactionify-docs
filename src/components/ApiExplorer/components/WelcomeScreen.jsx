import React from 'react';
import { MethodBadge } from './MethodBadge';
import styles from '../styles.module.css';

// ── WelcomeScreen ─────────────────────────────────────────────────────────
// Shown in the main content area when no endpoint is selected.
// Displays a title, subtitle, and a row of quick-access chips —
// one per endpoint — that navigate directly to that endpoint's panel.
//
// Props:
//   endpoints — full ENDPOINTS array from endpoints.js
//   onSelect  — callback (index: number) => void called when a chip is clicked
export function WelcomeScreen({ endpoints, onSelect }) {
  return (
    <div className={styles.welcome}>
      <div className={styles.welcomeTitle}>API Explorer</div>
      <p className={styles.welcomeSub}>
        Select an endpoint from the sidebar to inspect parameters, send live
        requests, and view responses.
      </p>

      {/* Quick-access chips — one per endpoint */}
      <div className={styles.welcomeChips}>
        {endpoints.map((ep, i) => (
          <button
            key={i}
            className={styles.welcomeChip}
            onClick={() => onSelect(i)} // Tell the parent to select this endpoint
          >
            <MethodBadge method={ep.method} size="Xs" />
            {ep.summary}
          </button>
        ))}
      </div>
    </div>
  );
}