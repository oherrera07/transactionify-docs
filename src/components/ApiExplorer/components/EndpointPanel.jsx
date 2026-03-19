import React, { useState, useCallback } from 'react';
import { MethodBadge } from './MethodBadge';
import { ParamSection } from './ParamSection';
import { BodySection } from './BodySection';
import { ResponseViewer } from './ResponseViewer';
import { useApiBase } from '../hooks/useApiBase';
import { buildUrl } from '../utils';
import styles from '../styles.module.css';

// ── EndpointPanel ─────────────────────────────────────────────────────────
// The main detail view for a single endpoint. Rendered when the user selects
// an endpoint from the sidebar.
//
// Responsibilities:
// - Renders the endpoint header (method badge + path)
// - Manages state for all user inputs: path params, query params, body
// - Sends the HTTP request and stores the response
// - Delegates rendering of each section to focused child components
//
// Props:
//   ep     — endpoint definition object from ENDPOINTS
//   apiKey — current API key value from the global key bar
//
// Note: this component is mounted with key={selected} in the parent,
// which means it fully resets (all state cleared) when the user
// switches to a different endpoint.
export function EndpointPanel({ ep, apiKey }) {
  const apiBase = useApiBase();

  // ── Input state ───────────────────────────────────────────────────────
  // Initialized lazily from the endpoint definition so the inputs start
  // with useful placeholder values from the endpoint config.

  // { param_name: value } map for path parameter inputs
  const [pathVals, setPathVals] = useState(() =>
    Object.fromEntries(ep.pathParams.map((p) => [p.name, p.example || '']))
  );

  // { param_name: value } map for query parameter inputs
  const [queryVals, setQueryVals] = useState(() =>
    Object.fromEntries(ep.queryParams.map((p) => [p.name, p.example || '']))
  );

  // Request body textarea content — pre-filled with the first example if available
  const [bodyVal, setBodyVal] = useState(() =>
    ep.examples[0]?.body ? JSON.stringify(ep.examples[0].body, null, 2) : ''
  );

  // ── Request state ─────────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false); // True while fetch is in-flight
  const [response, setResponse] = useState(null);  // Last response, or null if none yet

  // Reactively rebuild the URL whenever path/query inputs change
  const url = buildUrl(ep, pathVals, queryVals, apiBase);

  // Build the path display with {param} segments wrapped in a styled span
  const pathHtml = ep.path.replace(
    /{([^}]+)}/g,
    `<span class="${styles.pathVar}">{$1}</span>`
  );

  // ── send ──────────────────────────────────────────────────────────────
  // Fires the HTTP request using the current input values.
  // useCallback prevents recreation on every render — only recreates when
  // url, ep, bodyVal, or apiKey actually change.
  const send = useCallback(async () => {
    setLoading(true);
    setResponse(null);

    const headers = { 'Content-Type': 'application/json' };

    // Normalize API key to "APIKey <key>" format if not already prefixed
    if (apiKey)
      headers['Authorization'] = apiKey.startsWith('APIKey ')
        ? apiKey
        : `APIKey ${apiKey}`;

    const opts = { method: ep.method, headers };

    // Only attach a body for methods that support it (POST, PUT, PATCH)
    if (ep.body && bodyVal.trim()) opts.body = bodyVal.trim();

    const t0 = Date.now(); // Record start time for elapsed ms calculation

    try {
      const res = await fetch(url, opts);
      const ms  = Date.now() - t0;

      // Collect response headers into a plain object for display
      const respHeaders = {};
      res.headers.forEach((v, k) => (respHeaders[k] = v));

      // Parse body as JSON if content-type indicates it, otherwise read as text
      const ct   = res.headers.get('content-type') || '';
      const body = ct.includes('json')
        ? JSON.stringify(await res.json(), null, 2)
        : await res.text();

      setResponse({ status: res.status, ms, body, headers: respHeaders });
    } catch (e) {
      // Network-level errors (CORS, offline, timeout) land here
      // status 0 is used as a sentinel for "no HTTP response received"
      setResponse({
        status: 0,
        ms: Date.now() - t0,
        body: `Network error: ${e.message}`,
        headers: {},
      });
    }

    setLoading(false);
  }, [url, ep, bodyVal, apiKey]);

  return (
    <div className={styles.panel}>

      {/* ── Header: method badge + path ── */}
      <div className={styles.panelHeader}>
        <MethodBadge method={ep.method} size="Lg" />
        {/* dangerouslySetInnerHTML is safe here — pathHtml is built by us, not from user input */}
        <code
          className={styles.panelPath}
          dangerouslySetInnerHTML={{ __html: pathHtml }}
        />
      </div>
      <p className={styles.panelDesc}>{ep.description}</p>

      {/* ── Auth reminder ── */}
      <div className={styles.authNote}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path
            d="M8 1a3.5 3.5 0 0 0-3.5 3.5v1.25H3A1 1 0 0 0 2 6.75v7A1 1 0 0 0 3 14.75h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1.5V4.5A3.5 3.5 0 0 0 8 1zm0 1.5A2 2 0 0 1 10 4.5v1.25H6V4.5A2 2 0 0 1 8 2.5z"
            fill="currentColor"
          />
        </svg>
        Requires <strong style={{ margin: '0 4px' }}>Authorization: APIKey &lt;key&gt;</strong> — set your key at the top.
      </div>

      {/* ── Path parameters ── */}
      <ParamSection
        title="Path Parameters"
        params={ep.pathParams}
        values={pathVals}
        onChange={(name, val) => setPathVals((v) => ({ ...v, [name]: val }))}
        location="path"
      />

      {/* ── Query parameters ── */}
      <ParamSection
        title="Query Parameters"
        params={ep.queryParams}
        values={queryVals}
        onChange={(name, val) => setQueryVals((v) => ({ ...v, [name]: val }))}
        location="query"
      />

      {/* ── Request body — only rendered for endpoints with body: true ── */}
      {ep.body && (
        <BodySection
          examples={ep.examples}
          bodyVal={bodyVal}
          onChange={setBodyVal}
        />
      )}

      {/* ── Send button ── */}
      <div className={styles.sendRow}>
        <button className={styles.sendBtn} onClick={send} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : null}
          {loading ? 'Sending…' : 'Send Request'}
        </button>
      </div>

      {/* ── Response — only rendered after a request has been made ── */}
      {response && <ResponseViewer response={response} />}

    </div>
  );
}