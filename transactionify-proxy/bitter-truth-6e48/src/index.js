const TARGET = 'https://gj7edrv1il.execute-api.us-east-1.amazonaws.com';
const ALLOWED_ORIGIN = 'https://oherrera07.github.io';

export default {
  async fetch(request) {
    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Construir URL destino
    const url = new URL(request.url);
    const targetUrl = TARGET + url.pathname + url.search;

    // Clonar request hacia la API real
    const proxiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : null,
    });

    // Hacer el request a AWS
    const response = await fetch(proxiedRequest);

    // Devolver respuesta con headers CORS
    const newResponse = new Response(response.body, response);
    corsHeaders().forEach((value, key) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  },
};

function corsHeaders() {
  return new Headers({
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
  });
}
