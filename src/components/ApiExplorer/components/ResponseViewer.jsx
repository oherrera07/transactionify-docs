import React, { useState } from 'react';
import { highlight } from '../utils';
import styles from '../styles.module.css';

// ── ResponseViewer ────────────────────────────────────────────────────────
// Renders the response panel shown after a request is sent.
// Displays the HTTP status code, elapsed time, and a tab switcher
// between the response body (syntax-highlighted JSON) and headers.
//
// Props:
//   response — object returned from the fetch call in EndpointPanel:
//     {
//       status  — HTTP status code (0 for network errors)
//       ms      — elapsed time in milliseconds
//       body    — response body as a string
//       headers — response headers as a plain { key: value } object
//     }
export function ResponseViewer({ response }) {
  // Controls which tab is active: 'body' or 'headers'
  const [activeTab, setActiveTab] = useState('body');

  // Map status code ranges to CSS classes for color-coded badge
  const statusClass =
    response.status === 0   ? styles.s0xx :  // Network error
    response.status < 300   ? styles.s2xx :  // Success
    response.status < 500   ? styles.s4xx :  // Client error
                              styles.s5xx;   // Server error

  return (
    <div className={styles.respWrap}>
      <hr className={styles.divider} />

      {/* Status badge + elapsed time */}
      <div className={styles.respHead}>
        <span className={`${styles.statusBadge} ${statusClass}`}>
          {response.status === 0 ? 'Error' : response.status}
        </span>
        <span className={styles.respTime}>{response.ms}ms</span>
      </div>

      {/* Tab switcher: Body | Headers */}
      <div className={styles.respTabs}>
        {['body', 'headers'].map((t) => (
          <button
            key={t}
            className={`${styles.respTab} ${activeTab === t ? styles.respTabActive : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Body tab — syntax-highlighted JSON */}
      {activeTab === 'body' && (
        <pre
          className={styles.respBody}
          // highlight() returns sanitized HTML with <span> color tags
          dangerouslySetInnerHTML={{ __html: highlight(response.body) }}
        />
      )}

      {/* Headers tab — key/value table */}
      {activeTab === 'headers' && (
        <table className={styles.hdrTable}>
          <tbody>
            {Object.entries(response.headers).map(([k, v]) => (
              <tr key={k}>
                <td className={styles.hdrKey}>{k}</td>
                <td className={styles.hdrVal}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}