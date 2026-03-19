import React from 'react';
import styles from '../styles.module.css';

// ── ParamSection ──────────────────────────────────────────────────────────
// Renders a labeled section of input fields for either path or query parameters.
// Reused for both parameter types — the only difference is the `title` and
// `location` labels passed as props.
//
// Props:
//   title    — section heading e.g. "Path Parameters" or "Query Parameters"
//   params   — array of parameter definitions from the endpoint config
//   values   — current input values keyed by param name { param_name: value }
//   onChange — callback (name, value) => void called on each input change
//   location — label shown in the "where" chip: "path" or "query"
//
// Returns null if the params array is empty, so the section is hidden entirely
// for endpoints that don't have that parameter type.
export function ParamSection({ title, params, values, onChange, location }) {
  // Don't render the section at all if there are no params of this type
  if (!params.length) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>{title}</div>
      {params.map((p) => (
        <div key={p.name} className={styles.paramRow}>

          {/* Left column: param name, required indicator, type and location chips */}
          <div className={styles.paramLabel}>
            <span className={styles.paramName}>
              {p.name}
              {p.required && <span className={styles.reqStar}>*</span>}
            </span>
            <div className={styles.paramMeta}>
              <span className={styles.typeChip}>{p.type}</span>
              <span className={styles.whereChip}>{location}</span>
            </div>
          </div>

          {/* Right column: text input + description */}
          <div>
            <input
              type="text"
              className={styles.input}
              value={values[p.name] || ''}
              placeholder={p.example || p.name}
              onChange={(e) => onChange(p.name, e.target.value)}
            />
            <div className={styles.paramDesc}>{p.description}</div>
          </div>

        </div>
      ))}
    </div>
  );
}