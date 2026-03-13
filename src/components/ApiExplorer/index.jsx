import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// In dev, requests go to /api-proxy/* which Docusaurus proxies to the real API.
// In production build, replace this with your Cloudflare Worker URL.


const ENDPOINTS = [
  {
    tag: 'Accounts',
    method: 'POST',
    path: '/api/v1/accounts',
    summary: 'Create account',
    description:
      'Creates a new account with the specified currency. The account starts with a zero balance.',
    pathParams: [],
    queryParams: [],
    body: true,
    bodyFields: [
      {
        name: 'currency',
        type: 'enum',
        required: true,
        enum: ['USD', 'EUR', 'GBP'],
        description: 'Currency code for the new account',
      },
    ],
    examples: [
      { label: 'USD', body: { currency: 'USD' } },
      { label: 'EUR', body: { currency: 'EUR' } },
      { label: 'GBP', body: { currency: 'GBP' } },
    ],
  },
  {
    tag: 'Payments',
    method: 'POST',
    path: '/api/v1/accounts/{account_id}/payments',
    summary: 'Create payment',
    description:
      'Creates a new payment for the specified account. The payment currency must match the account currency.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '019a4757-c049-7ea8-a110-2ea110c5a6f8',
      },
    ],
    queryParams: [],
    body: true,
    bodyFields: [
      {
        name: 'amount.value',
        type: 'string',
        required: true,
        description: 'Monetary amount — e.g. "100.00"',
        example: '100.00',
      },
      {
        name: 'amount.currency',
        type: 'enum',
        required: true,
        description: 'Must match the account currency',
        enum: ['USD', 'EUR', 'GBP'],
        example: 'USD',
      },
    ],
    examples: [
      { label: '$100 USD', body: { amount: { value: '100.00', currency: 'USD' } } },
      { label: '€50 EUR',  body: { amount: { value: '50.00',  currency: 'EUR' } } },
      { label: '£25 GBP',  body: { amount: { value: '25.00',  currency: 'GBP' } } },
    ],
  },
  {
    tag: 'Balance',
    method: 'GET',
    path: '/api/v1/accounts/{account_id}/balance',
    summary: 'Get balance',
    description:
      'Retrieves the current balance for the specified account, including the current server date/time.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '019a4757-c049-7ea8-a110-2ea110c5a6f8',
      },
    ],
    queryParams: [],
    body: false,
    examples: [],
  },
  {
    tag: 'Transactions',
    method: 'GET',
    path: '/api/v1/accounts/{account_id}/transactions',
    summary: 'List transactions',
    description:
      'Retrieves paginated transaction history for the specified account using cursor-based pagination.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '019a4757-c049-7ea8-a110-2ea110c5a6f8',
      },
    ],
    queryParams: [
      {
        name: 'limit',
        required: false,
        type: 'integer',
        description: 'Results per page (1–100, default 20)',
        example: '20',
      },
      {
        name: 'cursor',
        required: false,
        type: 'string',
        description: 'Pagination cursor from a previous response',
        example: '',
      },
    ],
    body: false,
    examples: [],
  },
];

// Method badge colors — brand-consistent
const METHOD_COLORS = {
  GET:    { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
  POST:   { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5' },
  PUT:    { bg: 'rgba(245,158,11,0.1)',  color: '#b45309' },
  PATCH:  { bg: 'rgba(245,158,11,0.1)',  color: '#b45309' },
  DELETE: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
};

// Dark mode overrides for method badges
const METHOD_COLORS_DARK = {
  GET:    { bg: 'rgba(16,185,129,0.15)',  color: '#34d399' },
  POST:   { bg: 'rgba(99,102,241,0.15)',  color: '#a5b4fc' },
  PUT:    { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  PATCH:  { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  DELETE: { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
};

function useIsDark() {
  const [dark, setDark] = React.useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') === 'dark'
      : false
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

function MethodBadge({ method, size = 'Sm' }) {
  const dark = useIsDark();
  const palette = dark ? METHOD_COLORS_DARK : METHOD_COLORS;
  const s = palette[method] || {};
  return (
    <span
      className={styles[`badge${size}`]}
      style={{ background: s.bg, color: s.color }}
    >
      {method}
    </span>
  );
}

function highlight(raw) {
  let s;
  try { s = JSON.stringify(JSON.parse(raw), null, 2); } catch { s = raw; }
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(?:[^"\\]|\\.)*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (m) => {
        if (m.startsWith('"') && m.trimEnd().endsWith(':'))
          return `<span class="${styles.jKey}">${m}</span>`;
        if (m.startsWith('"'))
          return `<span class="${styles.jStr}">${m}</span>`;
        if (m === 'true' || m === 'false')
          return `<span class="${styles.jBool}">${m}</span>`;
        if (m === 'null')
          return `<span class="${styles.jNull}">${m}</span>`;
        return `<span class="${styles.jNum}">${m}</span>`;
      }
    );
}

function useApiBase() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields.apiBase;
}

function buildUrl(ep, pathVals, queryVals, base) {
  let url = base + ep.path;
  ep.pathParams.forEach((p) => {
    url = url.replace(`{${p.name}}`, encodeURIComponent(pathVals[p.name] || `{${p.name}}`));
  });
  const qps = ep.queryParams
    .filter((p) => queryVals[p.name])
    .map((p) => `${p.name}=${encodeURIComponent(queryVals[p.name])}`);
  if (qps.length) url += '?' + qps.join('&');
  return url;
}

// ── Endpoint Panel ────────────────────────────────────────────────────────
function EndpointPanel({ ep, apiKey }) {
  const apiBase = useApiBase();
  const initPath  = Object.fromEntries(ep.pathParams.map((p) => [p.name, p.example || '']));
  const initQuery = Object.fromEntries(ep.queryParams.map((p) => [p.name, p.example || '']));
  const initBody  = ep.examples[0]?.body ? JSON.stringify(ep.examples[0].body, null, 2) : '';

  const [pathVals,  setPathVals]  = useState(initPath);
  const [queryVals, setQueryVals] = useState(initQuery);
  const [bodyVal,   setBodyVal]   = useState(initBody);
  const [loading,   setLoading]   = useState(false);
  const [response,  setResponse]  = useState(null);
  const [activeTab, setActiveTab] = useState('body');

  const url = buildUrl(ep, pathVals, queryVals, apiBase);

  const send = useCallback(async () => {
    setLoading(true);
    setResponse(null);
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey)
      headers['Authorization'] = apiKey.startsWith('APIKey ') ? apiKey : `APIKey ${apiKey}`;
    const opts = { method: ep.method, headers };
    if (ep.body && bodyVal.trim()) opts.body = bodyVal.trim();
    const t0 = Date.now();
    try {
      const res = await fetch(url, opts);
      const ms  = Date.now() - t0;
      const respHeaders = {};
      res.headers.forEach((v, k) => (respHeaders[k] = v));
      const ct   = res.headers.get('content-type') || '';
      const body = ct.includes('json')
        ? JSON.stringify(await res.json(), null, 2)
        : await res.text();
      setResponse({ status: res.status, ms, body, headers: respHeaders });
    } catch (e) {
      setResponse({ status: 0, ms: Date.now() - t0, body: `Network error: ${e.message}`, headers: {} });
    }
    setLoading(false);
  }, [url, ep, bodyVal, apiKey]);

  const statusClass =
    !response          ? '' :
    response.status === 0   ? styles.s0xx :
    response.status < 300   ? styles.s2xx :
    response.status < 500   ? styles.s4xx : styles.s5xx;

  // Build path HTML with CSS-module pathVar class
  const pathHtml = ep.path.replace(
    /{([^}]+)}/g,
    `<span class="${styles.pathVar}">{$1}</span>`
  );

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <MethodBadge method={ep.method} size="Lg" />
        <code
          className={styles.panelPath}
          dangerouslySetInnerHTML={{ __html: pathHtml }}
        />
      </div>
      <p className={styles.panelDesc}>{ep.description}</p>

      {/* Auth note */}
      <div className={styles.authNote}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path
            d="M8 1a3.5 3.5 0 0 0-3.5 3.5v1.25H3A1 1 0 0 0 2 6.75v7A1 1 0 0 0 3 14.75h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1.5V4.5A3.5 3.5 0 0 0 8 1zm0 1.5A2 2 0 0 1 10 4.5v1.25H6V4.5A2 2 0 0 1 8 2.5z"
            fill="currentColor"
          />
        </svg>
        Requires{' '}
        <strong style={{ margin: '0 4px' }}>Authorization: APIKey &lt;key&gt;</strong> — set your
        key at the top.
      </div>

      {/* Path params */}
      {ep.pathParams.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHead}>Path Parameters</div>
          {ep.pathParams.map((p) => (
            <div key={p.name} className={styles.paramRow}>
              <div className={styles.paramLabel}>
                <span className={styles.paramName}>
                  {p.name} {p.required && <span className={styles.reqStar}>*</span>}
                </span>
                <div className={styles.paramMeta}>
                  <span className={styles.typeChip}>{p.type}</span>
                  <span className={styles.whereChip}>path</span>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  className={styles.input}
                  value={pathVals[p.name] || ''}
                  placeholder={p.example || p.name}
                  onChange={(e) => setPathVals((v) => ({ ...v, [p.name]: e.target.value }))}
                />
                <div className={styles.paramDesc}>{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Query params */}
      {ep.queryParams.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHead}>Query Parameters</div>
          {ep.queryParams.map((p) => (
            <div key={p.name} className={styles.paramRow}>
              <div className={styles.paramLabel}>
                <span className={styles.paramName}>
                  {p.name} {p.required && <span className={styles.reqStar}>*</span>}
                </span>
                <div className={styles.paramMeta}>
                  <span className={styles.typeChip}>{p.type}</span>
                  <span className={styles.whereChip}>query</span>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  className={styles.input}
                  value={queryVals[p.name] || ''}
                  placeholder={p.example || ''}
                  onChange={(e) => setQueryVals((v) => ({ ...v, [p.name]: e.target.value }))}
                />
                <div className={styles.paramDesc}>{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      {ep.body && (
        <div className={styles.section}>
          <div className={styles.sectionHead}>Request Body — application/json</div>
          {ep.examples.length > 0 && (
            <div className={styles.exPills}>
              {ep.examples.map((ex) => (
                <button
                  key={ex.label}
                  className={styles.exPill}
                  onClick={() => setBodyVal(JSON.stringify(ex.body, null, 2))}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}
          <textarea
            className={styles.textarea}
            value={bodyVal}
            onChange={(e) => setBodyVal(e.target.value)}
            spellCheck={false}
            rows={6}
          />
        </div>
      )}

      {/* Send */}
      <div className={styles.sendRow}>
        <button className={styles.sendBtn} onClick={send} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : null}
          {loading ? 'Sending…' : 'Send Request'}
        </button>
        <code className={styles.urlPreview}>{url}</code>
      </div>

      {/* Response */}
      {response && (
        <div className={styles.respWrap}>
          <hr className={styles.divider} />
          <div className={styles.respHead}>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {response.status === 0 ? 'Error' : response.status}
            </span>
            <span className={styles.respTime}>{response.ms}ms</span>
          </div>
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
          {activeTab === 'body' && (
            <pre
              className={styles.respBody}
              dangerouslySetInnerHTML={{ __html: highlight(response.body) }}
            />
          )}
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
      )}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────
export default function ApiExplorer() {
  const [apiKey,   setApiKey]   = useState('');
  const [selected, setSelected] = useState(null);

  const groups = ENDPOINTS.reduce((acc, ep, i) => {
    (acc[ep.tag] = acc[ep.tag] || []).push({ ...ep, idx: i });
    return acc;
  }, {});

  return (
    <div className={styles.root}>
      {/* API Key bar */}
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
        <span className={styles.baseUrl}>
          gj7edrv1il.execute-api.us-east-1.amazonaws.com
        </span>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {Object.entries(groups).map(([tag, eps]) => (
            <div key={tag} className={styles.sideGroup}>
              <div className={styles.sideGroupLabel}>{tag}</div>
              {eps.map((ep) => (
                <button
                  key={ep.idx}
                  className={`${styles.sideBtn} ${selected === ep.idx ? styles.sideBtnActive : ''}`}
                  onClick={() => setSelected(ep.idx)}
                >
                  <MethodBadge method={ep.method} size="Sm" />
                  <span className={styles.sidePath}>
                    {ep.path.replace('/api/v1', '')}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div className={styles.content}>
          {selected === null ? (
            <div className={styles.welcome}>
              <div className={styles.welcomeTitle}>API Explorer</div>
              <p className={styles.welcomeSub}>
                Select an endpoint from the sidebar to inspect parameters, send live
                requests, and view responses.
              </p>
              <div className={styles.welcomeChips}>
                {ENDPOINTS.map((ep, i) => (
                  <button
                    key={i}
                    className={styles.welcomeChip}
                    onClick={() => setSelected(i)}
                  >
                    <MethodBadge method={ep.method} size="Xs" />
                    {ep.summary}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <EndpointPanel key={selected} ep={ENDPOINTS[selected]} apiKey={apiKey} />
          )}
        </div>
      </div>
    </div>
  );
}
