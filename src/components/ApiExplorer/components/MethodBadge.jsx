import React from 'react';
import styles from '../styles.module.css';

// ── MethodBadge ───────────────────────────────────────────────────────────
// Renders a colored pill showing the HTTP method (GET, POST, etc.).
// Colors are handled entirely by CSS — light/dark mode switching is done
// via the [data-theme='dark'] selector in styles.module.css, so no JS
// theme detection is needed here.
//
// Props:
//   method — HTTP method string e.g. "GET", "POST"
//   size   — controls font size and padding: "Xs", "Sm" (default), "Lg"
const METHOD_CLASS_MAP = {
  GET:    styles.methodGet,
  POST:   styles.methodPost,
  PUT:    styles.methodPut,
  PATCH:  styles.methodPatch,
  DELETE: styles.methodDelete,
};

export function MethodBadge({ method, size = 'Sm' }) {
  const sizeClass   = styles[`badge${size}`];
  const methodClass = METHOD_CLASS_MAP[method] || '';

  return (
    <span className={`${sizeClass} ${methodClass}`}>
      {method}
    </span>
  );
}