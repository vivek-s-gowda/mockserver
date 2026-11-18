// day-11-mockserver/src/mockEngine.js
// Mock API routing, dynamic response templating, latency simulation & contract exporters

const FAKER_DATA = {
  names: ['Alex Rivera', 'Jordan Hayes', 'Taylor Brooks', 'Morgan Vance', 'Casey Sterling', 'Elena Rostova', 'Kenji Sato'],
  companies: ['VaporCore Technologies', 'Aether Dynamics', 'Solaria Cybernetics', 'PulseGrid Networks', 'Zenith Logistics'],
  domains: ['example.io', 'hyperlink.dev', 'synthwave.cloud', 'orbit.network'],
  cities: ['Neo-Tokyo', 'San Francisco', 'Berlin', 'Kyoto', 'Singapore', 'Austin']
};

/**
 * Resolves templating tokens in mock response strings.
 * e.g. {{faker.uuid}}, {{faker.name}}, {{param.id}}, {{query.limit}}
 */
export function resolveTemplate(templateStr, context = {}) {
  if (typeof templateStr !== 'string') return templateStr;

  const { params = {}, query = {} } = context;

  return templateStr.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, token) => {
    // Faker helpers
    if (token === 'faker.uuid') {
      return 'uid_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    }
    if (token === 'faker.name') {
      return FAKER_DATA.names[Math.floor(Math.random() * FAKER_DATA.names.length)];
    }
    if (token === 'faker.email') {
      const name = FAKER_DATA.names[Math.floor(Math.random() * FAKER_DATA.names.length)].toLowerCase().replace(' ', '.');
      const domain = FAKER_DATA.domains[Math.floor(Math.random() * FAKER_DATA.domains.length)];
      return `${name}@${domain}`;
    }
    if (token === 'faker.company') {
      return FAKER_DATA.companies[Math.floor(Math.random() * FAKER_DATA.companies.length)];
    }
    if (token === 'faker.city') {
      return FAKER_DATA.cities[Math.floor(Math.random() * FAKER_DATA.cities.length)];
    }
    if (token === 'faker.number') {
      return String(Math.floor(Math.random() * 9000) + 1000);
    }
    if (token === 'faker.date') {
      return new Date().toISOString();
    }
    if (token === 'faker.boolean') {
      return Math.random() > 0.5 ? 'true' : 'false';
    }

    // Path parameters
    if (token.startsWith('param.')) {
      const paramKey = token.replace('param.', '');
      return params[paramKey] !== undefined ? params[paramKey] : match;
    }

    // Query parameters
    if (token.startsWith('query.')) {
      const queryKey = token.replace('query.', '');
      return query[queryKey] !== undefined ? query[queryKey] : match;
    }

    return match;
  });
}

/**
 * Matches a parameterized route path against a requested URL path.
 * e.g. /api/users/:id matches /api/users/123 -> { matches: true, params: { id: '123' } }
 */
export function matchRoute(routePath, requestUrl) {
  // Separate pathname and query string
  let pathname = requestUrl;
  const query = {};

  const qIndex = requestUrl.indexOf('?');
  if (qIndex !== -1) {
    pathname = requestUrl.substring(0, qIndex);
    const queryString = requestUrl.substring(qIndex + 1);
    const pairs = queryString.split('&');
    for (const p of pairs) {
      if (!p) continue;
      const [k, v] = p.split('=');
      query[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }
  }

  // Normalize slashes
  const routeSegments = routePath.replace(/^\/+|\/+$/g, '').split('/');
  const pathSegments = pathname.replace(/^\/+|\/+$/g, '').split('/');

  if (routeSegments.length !== pathSegments.length) {
    return { matches: false, params: {}, query };
  }

  const params = {};
  for (let i = 0; i < routeSegments.length; i++) {
    const rSeg = routeSegments[i];
    const pSeg = pathSegments[i];

    if (rSeg.startsWith(':')) {
      const paramName = rSeg.substring(1);
      params[paramName] = decodeURIComponent(pSeg);
    } else if (rSeg !== pSeg) {
      return { matches: false, params: {}, query };
    }
  }

  return { matches: true, params, query };
}

/**
 * Dispatches a simulated in-browser mock HTTP request.
 */
export async function dispatchMockRequest(routes, req) {
  const { method = 'GET', url = '/api/v1/ping' } = req;
  const startTime = performance.now();

  // Find matching route
  let matched = null;
  let params = {};
  let query = {};

  for (const r of routes) {
    if (r.method.toUpperCase() !== method.toUpperCase()) continue;
    const match = matchRoute(r.path, url);
    if (match.matches) {
      matched = r;
      params = match.params;
      query = match.query;
      break;
    }
  }

  if (!matched) {
    const elapsed = Math.round(performance.now() - startTime);
    return {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'NotFound', message: `No mock route configured for ${method} ${url}` }, null, 2),
      durationMs: elapsed,
      matchedRoute: null
    };
  }

  // Simulate latency
  const latency = Number(matched.latencyMs) || 50;
  if (latency > 0) {
    await new Promise((res) => setTimeout(res, latency));
  }

  // Resolve templated response
  const rawBody = matched.responseBody || '{}';
  const resolvedBody = resolveTemplate(rawBody, { params, query, body: req.body });

  const elapsed = Math.round(performance.now() - startTime);

  return {
    status: Number(matched.status) || 200,
    statusText: getStatusText(Number(matched.status) || 200),
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'MockServer-Studio-Vaporwave',
      ...(matched.headers || {})
    },
    body: resolvedBody,
    durationMs: elapsed,
    matchedRoute: matched
  };
}

function getStatusText(code) {
  const statusMap = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };
  return statusMap[code] || 'Custom Status';
}

/**
 * Exports routes to OpenAPI 3.0.0 JSON specification.
 */
export function exportToOpenApi(routes, title = 'MockServer Studio API') {
  const paths = {};

  routes.forEach((r) => {
    // Convert /users/:id to /users/{id}
    const openApiPath = r.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    if (!paths[openApiPath]) paths[openApiPath] = {};

    const methodLower = r.method.toLowerCase();
    const parameters = [];

    // Extract path params
    const paramMatches = r.path.match(/:([a-zA-Z0-9_]+)/g);
    if (paramMatches) {
      paramMatches.forEach((p) => {
        parameters.push({
          name: p.substring(1),
          in: 'path',
          required: true,
          schema: { type: 'string' }
        });
      });
    }

    let parsedExample = {};
    try {
      parsedExample = JSON.parse(r.responseBody || '{}');
    } catch {
      parsedExample = { raw: r.responseBody };
    }

    paths[openApiPath][methodLower] = {
      summary: r.name || `${r.method} ${r.path}`,
      description: r.description || `Mocked ${r.method} endpoint on ${r.path}`,
      parameters: parameters.length > 0 ? parameters : undefined,
      responses: {
        [r.status]: {
          description: `Successful mock response (${r.status})`,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: parsedExample
            }
          }
        }
      }
    };
  });

  const spec = {
    openapi: '3.0.0',
    info: {
      title,
      version: '1.0.0',
      description: 'Auto-generated OpenAPI 3.0 contract from MockServer Studio'
    },
    paths
  };

  return JSON.stringify(spec, null, 2);
}

/**
 * Exports routes to Mock Service Worker (MSW 2.x) handlers.
 */
export function exportToMsw(routes) {
  const handlers = routes.map((r) => {
    const m = r.method.toLowerCase();
    return `  http.${m}('${r.path}', async ({ request, params }) => {
    await delay(${r.latencyMs || 50});
    return HttpResponse.json(${r.responseBody ? r.responseBody.trim() : '{}'}, {
      status: ${r.status}
    });
  })`;
  });

  return `// mswHandlers.js
// Generated by MockServer Studio (MSW 2.x)
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
${handlers.join(',\n\n')}
];
`;
}

/**
 * Exports routes to Express.js Router code.
 */
export function exportToExpress(routes) {
  const code = routes.map((r) => {
    const m = r.method.toLowerCase();
    return `// ${r.name || r.path}
router.${m}('${r.path}', (req, res) => {
  setTimeout(() => {
    res.status(${r.status}).json(${r.responseBody ? r.responseBody.trim() : '{}'});
  }, ${r.latencyMs || 50});
});`;
  });

  return `// mockRouter.js
// Express.js Mock Server Router
import express from 'express';
const router = express.Router();

${code.join('\n\n')}

export default router;
`;
}
