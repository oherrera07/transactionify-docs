import styles from './styles.module.css';

// ── highlight ─────────────────────────────────────────────────────────────
// Takes a raw string (typically a JSON response body) and returns an HTML
// string with <span> tags for syntax coloring.
// Used by ResponseViewer to render colored JSON in the response panel.
//
// Steps:
// 1. Try to parse and re-stringify the input to ensure consistent formatting.
//    If the input is not valid JSON, use it as-is.
// 2. Escape HTML special characters to prevent XSS.
// 3. Apply regex to wrap each token type in a <span> with the correct CSS class.
export function highlight(raw) {
  let s;
  try {
    s = JSON.stringify(JSON.parse(raw), null, 2); // Pretty-print if valid JSON
  } catch {
    s = raw; // Not JSON — display as plain text
  }

  return s
    // Escape HTML special characters first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      // Regex matches: quoted strings (keys and values), booleans, null, numbers
      /("(?:[^"\\]|\\.)*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (m) => {
        // JSON key: quoted string followed by a colon
        if (m.startsWith('"') && m.trimEnd().endsWith(':'))
          return `<span class="${styles.jKey}">${m}</span>`;
        // JSON string value
        if (m.startsWith('"'))
          return `<span class="${styles.jStr}">${m}</span>`;
        // Boolean value
        if (m === 'true' || m === 'false')
          return `<span class="${styles.jBool}">${m}</span>`;
        // Null value
        if (m === 'null')
          return `<span class="${styles.jNull}">${m}</span>`;
        // Numeric value
        return `<span class="${styles.jNum}">${m}</span>`;
      }
    );
}

// ── buildUrl ──────────────────────────────────────────────────────────────
// Constructs the full request URL from an endpoint definition and current
// input values.
//
// - Replaces {param} placeholders in the path with actual values from pathVals.
//   Falls back to the literal {param_name} string if the field is empty,
//   so the URL preview still shows the placeholder.
// - Appends non-empty query params as a ?key=value&key=value string.
// - Prepends the base URL (from Docusaurus config via useApiBase).
//
// Example:
//   base    = "https://api.example.com"
//   path    = "/api/v1/accounts/{account_id}/balance"
//   pathVals = { account_id: "019a4757-..." }
//   result  = "https://api.example.com/api/v1/accounts/019a4757-.../balance"
export function buildUrl(ep, pathVals, queryVals, base) {
  let url = base + ep.path;

  // Replace each {param} placeholder with the encoded input value
  ep.pathParams.forEach((p) => {
    url = url.replace(
      `{${p.name}}`,
      encodeURIComponent(pathVals[p.name] || `{${p.name}}`)
    );
  });

  // Build query string from non-empty query param inputs
  const qps = ep.queryParams
    .filter((p) => queryVals[p.name])
    .map((p) => `${p.name}=${encodeURIComponent(queryVals[p.name])}`);

  if (qps.length) url += '?' + qps.join('&');

  return url;
}