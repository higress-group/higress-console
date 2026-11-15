import assert from 'node:assert/strict';
import { test } from 'node:test';
import { REDACTED_VALUE, redactForLog, redactSensitiveData } from './redact-secrets.ts';

test('redacts provider and consumer credential fields in nested payloads', () => {
  const redacted = redactSensitiveData({
    name: 'provider',
    tokens: ['token-1'],
    rawConfigs: {
      apiTokens: ['raw-token'],
      awsAccessKey: 'aws-access',
      awsSecretKey: 'aws-secret',
      vertexAuthKey: 'vertex-secret',
      model: 'gpt-4',
    },
    credentials: [{ type: 'key-auth', values: ['consumer-secret'], key: 'x-api-key' }],
  });

  assert.equal(redacted.tokens, REDACTED_VALUE);
  assert.equal(redacted.rawConfigs.apiTokens, REDACTED_VALUE);
  assert.equal(redacted.rawConfigs.awsAccessKey, REDACTED_VALUE);
  assert.equal(redacted.rawConfigs.awsSecretKey, REDACTED_VALUE);
  assert.equal(redacted.rawConfigs.vertexAuthKey, REDACTED_VALUE);
  assert.equal(redacted.rawConfigs.model, 'gpt-4');
  assert.equal(redacted.credentials[0].values, REDACTED_VALUE);
  assert.equal(redacted.credentials[0].key, 'x-api-key');
  assert.equal(JSON.stringify(redacted).includes('token-1'), false);
  assert.equal(JSON.stringify(redacted).includes('aws-access'), false);
});

test('redacts authorization headers while preserving normal headers', () => {
  const redacted = redactSensitiveData({
    headers: {
      Authorization: 'Bearer session-token',
      'Content-Type': 'application/json',
    },
  });

  assert.equal(redacted.headers.Authorization, REDACTED_VALUE);
  assert.equal(redacted.headers['Content-Type'], 'application/json');
});

test('redacts JSON request bodies serialized as strings', () => {
  const data = JSON.stringify({
    name: 'provider',
    tokens: ['request-secret'],
    rawConfigs: { apiTokens: ['request-secret'], model: 'gpt-4' },
  });

  const redacted = redactSensitiveData({ data });

  assert.equal(redacted.data.includes('request-secret'), false);
  assert.deepEqual(JSON.parse(redacted.data), {
    name: 'provider',
    tokens: REDACTED_VALUE,
    rawConfigs: { apiTokens: REDACTED_VALUE, model: 'gpt-4' },
  });
});

test('leaves normal error messages and non-JSON data unchanged', () => {
  const error = new Error('Network Error');
  Object.assign(error, {
    config: {
      data: 'plain text payload',
      headers: { Authorization: 'Bearer session-token' },
    },
  });

  const redacted = redactForLog(error) as Record<string, any>;

  assert.equal(redacted.message, 'Network Error');
  assert.equal(redacted.config.data, 'plain text payload');
  assert.equal(redacted.config.headers.Authorization, REDACTED_VALUE);
});

test('does not throw on cyclic payloads', () => {
  const payload: Record<string, any> = { tokens: ['secret'] };
  payload.self = payload;

  const redacted = redactSensitiveData(payload);

  assert.equal(redacted.tokens, REDACTED_VALUE);
  assert.equal(redacted.self, '[Circular]');
});
