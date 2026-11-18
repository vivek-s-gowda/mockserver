// day-11-mockserver/tests/mockEngine.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchRoute,
  resolveTemplate,
  dispatchMockRequest,
  exportToOpenApi,
  exportToMsw,
  exportToExpress
} from '../src/mockEngine.js';

test('matchRoute handles exact matches and query strings', () => {
  const match = matchRoute('/api/v1/ping', '/api/v1/ping?test=true&foo=bar');
  assert.strictEqual(match.matches, true);
  assert.strictEqual(match.query.test, 'true');
  assert.strictEqual(match.query.foo, 'bar');

  const noMatch = matchRoute('/api/v1/ping', '/api/v1/pong');
  assert.strictEqual(noMatch.matches, false);
});

test('matchRoute extracts single and multi-path parameters', () => {
  const single = matchRoute('/api/v1/users/:id', '/api/v1/users/usr_99');
  assert.strictEqual(single.matches, true);
  assert.strictEqual(single.params.id, 'usr_99');

  const multi = matchRoute('/api/v1/orgs/:orgId/repos/:repoId', '/api/v1/orgs/cyber/repos/core');
  assert.strictEqual(multi.matches, true);
  assert.strictEqual(multi.params.orgId, 'cyber');
  assert.strictEqual(multi.params.repoId, 'core');
});

test('resolveTemplate interpolates params and query values', () => {
  const tpl = '{"userId": "{{param.id}}", "page": {{query.page}}}';
  const resolved = resolveTemplate(tpl, {
    params: { id: 'usr_123' },
    query: { page: '4' }
  });
  assert.strictEqual(resolved, '{"userId": "usr_123", "page": 4}');
});

test('resolveTemplate generates dynamic Faker values', () => {
  const tpl = 'Name: {{faker.name}}, Email: {{faker.email}}, UUID: {{faker.uuid}}';
  const resolved = resolveTemplate(tpl);
  assert.ok(!resolved.includes('{{faker.name}}'));
  assert.ok(!resolved.includes('{{faker.email}}'));
  assert.ok(!resolved.includes('{{faker.uuid}}'));
  assert.match(resolved, /@/); // Valid email structure
  assert.match(resolved, /uid_/); // Valid uuid prefix
});

test('dispatchMockRequest dispatches matched route with headers and status', async () => {
  const routes = [
    {
      id: 'r1',
      method: 'GET',
      path: '/api/v1/items/:id',
      status: 200,
      latencyMs: 10,
      responseBody: '{"id": "{{param.id}}", "active": true}'
    }
  ];

  const res = await dispatchMockRequest(routes, {
    method: 'GET',
    url: '/api/v1/items/42'
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.statusText, 'OK');
  assert.ok(res.body.includes('"id": "42"'));
  assert.ok(res.durationMs >= 10);
});

test('dispatchMockRequest returns 404 for unconfigured routes', async () => {
  const routes = [];
  const res = await dispatchMockRequest(routes, {
    method: 'GET',
    url: '/api/v1/unknown'
  });

  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.statusText, 'Not Found');
  assert.ok(res.body.includes('NotFound'));
});

test('exportToOpenApi creates valid OpenAPI 3.0 specification', () => {
  const routes = [
    {
      name: 'Get User',
      method: 'GET',
      path: '/api/v1/users/:id',
      status: 200,
      responseBody: '{"id": "usr_1", "name": "Vance"}'
    }
  ];

  const jsonStr = exportToOpenApi(routes, 'Test API');
  const spec = JSON.parse(jsonStr);

  assert.strictEqual(spec.openapi, '3.0.0');
  assert.strictEqual(spec.info.title, 'Test API');
  assert.ok(spec.paths['/api/v1/users/{id}']);
  assert.ok(spec.paths['/api/v1/users/{id}'].get);
  assert.strictEqual(spec.paths['/api/v1/users/{id}'].get.parameters[0].name, 'id');
});

test('exportToMsw generates valid MSW 2.0 handler definitions', () => {
  const routes = [
    {
      method: 'POST',
      path: '/api/v1/orders',
      status: 201,
      latencyMs: 100,
      responseBody: '{"orderId": "123"}'
    }
  ];

  const msw = exportToMsw(routes);
  assert.match(msw, /import \{ http, HttpResponse, delay \} from 'msw'/);
  assert.match(msw, /http\.post\('\/api\/v1\/orders'/);
  assert.match(msw, /status: 201/);
});

test('exportToExpress creates valid Express router script', () => {
  const routes = [
    {
      method: 'DELETE',
      path: '/api/v1/sessions/:id',
      status: 204,
      latencyMs: 50,
      responseBody: ''
    }
  ];

  const expressCode = exportToExpress(routes);
  assert.match(expressCode, /import express from 'express'/);
  assert.match(expressCode, /router\.delete\('\/api\/v1\/sessions\/:id'/);
  assert.match(expressCode, /res\.status\(204\)/);
});
