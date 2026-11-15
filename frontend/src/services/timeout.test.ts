import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_REQUEST_TIMEOUT,
  REQUEST_TIMEOUT_STORAGE_KEY,
  resolveRequestTimeout,
} from './timeout.ts';

/** Build a minimal storage stub returning a fixed value for the timeout key. */
function stubStorage(value: string | null): Pick<Storage, 'getItem'> {
  return {
    getItem: (key: string) => (key === REQUEST_TIMEOUT_STORAGE_KEY ? value : null),
  };
}

test('returns the configured value for a valid integer string', () => {
  assert.equal(resolveRequestTimeout(stubStorage('120000')), 120000);
});

test('returns the configured value for a valid decimal string', () => {
  assert.equal(resolveRequestTimeout(stubStorage('60000.5')), 60000.5);
});

test('falls back to default when the key is missing (null)', () => {
  assert.equal(resolveRequestTimeout(stubStorage(null)), DEFAULT_REQUEST_TIMEOUT);
});

test('falls back to default for an empty string', () => {
  assert.equal(resolveRequestTimeout(stubStorage('')), DEFAULT_REQUEST_TIMEOUT);
});

test('falls back to default for a non-numeric string', () => {
  assert.equal(resolveRequestTimeout(stubStorage('abc')), DEFAULT_REQUEST_TIMEOUT);
});

test('falls back to default for a negative number', () => {
  assert.equal(resolveRequestTimeout(stubStorage('-5')), DEFAULT_REQUEST_TIMEOUT);
});

test('falls back to default for zero', () => {
  assert.equal(resolveRequestTimeout(stubStorage('0')), DEFAULT_REQUEST_TIMEOUT);
});

test('default timeout constant is 60 seconds', () => {
  assert.equal(DEFAULT_REQUEST_TIMEOUT, 60 * 1000);
});
