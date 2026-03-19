// ── Endpoint definitions ──────────────────────────────────────────────────
// This is the single source of truth for all API endpoints shown in the explorer.
// Each object describes one endpoint: its HTTP method, path, parameters,
// request body fields, and pre-built example payloads.
//
// To add a new endpoint, add a new object to this array following the same shape.
//
// Shape:
// {
//   tag         — groups the endpoint under a section in the sidebar
//   method      — HTTP method: GET, POST, PUT, PATCH, DELETE
//   path        — URL path, use {param_name} for path parameters
//   summary     — short label shown in the sidebar and welcome screen chips
//   description — longer description shown in the endpoint detail panel
//   pathParams  — array of path parameter definitions (extracted from the path)
//   queryParams — array of query string parameter definitions
//   body        — boolean, true if this endpoint expects a JSON request body
//   bodyFields  — array of body field definitions (used for documentation only)
//   examples    — pre-built body payloads shown as clickable pills in the UI
// }

export const ENDPOINTS = [
  {
    tag: 'Accounts',
    method: 'POST',
    path: '/api/v1/accounts',
    summary: 'Create account',
    description: 'Creates a new account with the specified currency. The account starts with a zero balance.',
    pathParams: [],   // No path parameters for this endpoint
    queryParams: [],  // No query parameters for this endpoint
    body: true,       // Expects a JSON body
    bodyFields: [
      {
        name: 'currency',
        type: 'enum',
        required: true,
        enum: ['USD', 'EUR', 'GBP'],
        description: 'Currency code for the new account',
      },
    ],
    // Clicking a pill fills the body textarea with the corresponding payload
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
    description: 'Creates a new payment for the specified account. The payment currency must match the account currency.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '', // Pre-filled in the input field
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
    description: 'Retrieves the current balance for the specified account, including the current server date/time.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '',
      },
    ],
    queryParams: [],
    body: false,   // GET request — no body
    examples: [],
  },
  {
    tag: 'Transactions',
    method: 'GET',
    path: '/api/v1/accounts/{account_id}/transactions',
    summary: 'List transactions',
    description: 'Retrieves paginated transaction history for the specified account using cursor-based pagination.',
    pathParams: [
      {
        name: 'account_id',
        required: true,
        type: 'uuid',
        description: 'Account UUID (v7 format)',
        example: '',
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