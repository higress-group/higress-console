import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveWriteOnlyList, resolveWriteOnlyScalar } from './write-only.ts';

test('omitted and empty edit lists keep existing values', () => {
  assert.equal(resolveWriteOnlyList(undefined), null);
  assert.equal(resolveWriteOnlyList(null), null);
  assert.equal(resolveWriteOnlyList([]), null);
  assert.equal(resolveWriteOnlyList(['', null, undefined]), null);
});

test('non-empty edit lists replace existing values', () => {
  assert.deepEqual(resolveWriteOnlyList(['new-key', '', 'second-key']), ['new-key', 'second-key']);
});

test('an explicit list clear is distinguishable from an empty edit', () => {
  assert.deepEqual(resolveWriteOnlyList([], true), []);
  assert.deepEqual(resolveWriteOnlyList(['ignored'], true), []);
});

test('omitted and empty edit scalars keep existing values', () => {
  assert.equal(resolveWriteOnlyScalar(undefined), null);
  assert.equal(resolveWriteOnlyScalar(null), null);
  assert.equal(resolveWriteOnlyScalar(''), null);
});

test('non-empty edit scalars replace existing values', () => {
  assert.equal(resolveWriteOnlyScalar('new-secret'), 'new-secret');
});

test('an explicit scalar clear submits an empty string', () => {
  assert.equal(resolveWriteOnlyScalar('', true), '');
  assert.equal(resolveWriteOnlyScalar('ignored', true), '');
});

test('an unchanged consumer save submits the keep payload', () => {
  assert.deepEqual(
    { type: 'key-auth', values: resolveWriteOnlyList(['']) },
    { type: 'key-auth', values: null },
  );
});

test('an explicit consumer clear submits the clear payload', () => {
  assert.deepEqual(
    { type: 'key-auth', values: resolveWriteOnlyList([''], true) },
    { type: 'key-auth', values: [] },
  );
});

test('a consumer replacement submits only the new credential values', () => {
  assert.deepEqual(
    { type: 'key-auth', values: resolveWriteOnlyList(['new-key', '']) },
    { type: 'key-auth', values: ['new-key'] },
  );
});
