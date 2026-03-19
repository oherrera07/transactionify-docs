import React from 'react';
import styles from '../styles.module.css';

// ── BodySection ───────────────────────────────────────────────────────────
// Renders the request body editor for POST/PUT/PATCH endpoints.
// Includes optional example pills and a free-form JSON textarea.
//
// Props:
//   examples — array of pre-built payloads { label, body }
//              Clicking a pill fills the textarea with that payload.
//   bodyVal  — current textarea content (controlled)
//   onChange — callback (value: string) => void called on textarea change
//              and also when an example pill is clicked
export function BodySection({ examples, bodyVal, onChange }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>Request Body — application/json</div>

      {/* Example pills — only rendered if there are pre-built examples */}
      {examples.length > 0 && (
        <div className={styles.exPills}>
          {examples.map((ex) => (
            <button
              key={ex.label}
              className={styles.exPill}
              // Serialize the example body and push it into the textarea
              onClick={() => onChange(JSON.stringify(ex.body, null, 2))}
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {/* Free-form JSON editor — user can type or paste any body */}
      <textarea
        className={styles.textarea}
        value={bodyVal}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={6}
      />
    </div>
  );
}