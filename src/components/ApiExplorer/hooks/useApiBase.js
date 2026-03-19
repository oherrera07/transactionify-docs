import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// ── useApiBase ────────────────────────────────────────────────────────────
// Returns the base URL for API requests, read from docusaurus.config.js.
//
// The value is set in customFields.apiBase:
//   - In development: '/api-proxy' (proxied by Webpack devServer to the real API)
//   - In production: the Cloudflare Worker URL
//
// This keeps environment-specific URLs out of component code.
export function useApiBase() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields.apiBase;
}