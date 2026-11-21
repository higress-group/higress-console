import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  sanitizeRedirectValue,
  buildRedirectSearch,
} from './redirect.ts';

// --- sanitizeRedirectValue ---

test('sanitizeRedirectValue: null returns /', () => {
  assert.equal(sanitizeRedirectValue(null), '/');
});

test('sanitizeRedirectValue: undefined returns /', () => {
  assert.equal(sanitizeRedirectValue(undefined), '/');
});

test('sanitizeRedirectValue: empty string returns /', () => {
  assert.equal(sanitizeRedirectValue(''), '/');
});

test('sanitizeRedirectValue: root path returns /', () => {
  assert.equal(sanitizeRedirectValue('/'), '/');
});

test('sanitizeRedirectValue: simple path passes through', () => {
  assert.equal(sanitizeRedirectValue('/users'), '/users');
});

test('sanitizeRedirectValue: path with query passes through', () => {
  assert.equal(
    sanitizeRedirectValue('/users?tab=profile&id=42'),
    '/users?tab=profile&id=42',
  );
});

test('sanitizeRedirectValue: path with hash passes through', () => {
  assert.equal(sanitizeRedirectValue('/users#section'), '/users#section');
});

test('sanitizeRedirectValue: /login is collapsed to / (anti self-loop)', () => {
  assert.equal(sanitizeRedirectValue('/login'), '/');
});

test('sanitizeRedirectValue: /login with query is collapsed (anti self-loop)', () => {
  assert.equal(sanitizeRedirectValue('/login?next=1'), '/');
});

test('sanitizeRedirectValue: case-variant /LOGIN is collapsed (anti self-loop)', () => {
  assert.equal(sanitizeRedirectValue('/LOGIN'), '/');
  assert.equal(sanitizeRedirectValue('/Login'), '/');
});

test('sanitizeRedirectValue: protocol-relative URL is rejected', () => {
  assert.equal(sanitizeRedirectValue('//evil.com/x'), '/');
  assert.equal(sanitizeRedirectValue('///evil.com'), '/');
});

test('sanitizeRedirectValue: absolute http(s) URL is rejected', () => {
  assert.equal(sanitizeRedirectValue('https://evil.com'), '/');
  // eslint-disable-next-line @iceworks/best-practices/no-http-url
  assert.equal(sanitizeRedirectValue('http://evil.com'), '/');
});

test('sanitizeRedirectValue: javascript: scheme is rejected', () => {
  // eslint-disable-next-line no-script-url
  assert.equal(sanitizeRedirectValue('javascript:alert(1)'), '/');
});

test('sanitizeRedirectValue: data: scheme is rejected', () => {
  assert.equal(sanitizeRedirectValue('data:text/html,<x>'), '/');
});

test('sanitizeRedirectValue: leading whitespace is rejected', () => {
  assert.equal(sanitizeRedirectValue(' /foo'), '/');
});

test('sanitizeRedirectValue: ASCII tab in path is rejected (open-redirect bypass)', () => {
  // URLSearchParams decodes %09 to '\t'. WHATWG strips C0 controls before parsing,
  // so '/\t/evil.com' resolves to '//evil.com' = protocol-relative. Reject.
  assert.equal(sanitizeRedirectValue('/\t/evil.com'), '/');
});

test('sanitizeRedirectValue: ASCII LF in path is rejected (open-redirect bypass)', () => {
  assert.equal(sanitizeRedirectValue('/\n/evil.com'), '/');
});

test('sanitizeRedirectValue: ASCII CR in path is rejected (open-redirect bypass)', () => {
  assert.equal(sanitizeRedirectValue('/\r/evil.com'), '/');
});

test('sanitizeRedirectValue: backslash-leading is rejected', () => {
  assert.equal(sanitizeRedirectValue('\\foo'), '/');
});

test('sanitizeRedirectValue: slash-backslash prefix is rejected (open-redirect)', () => {
  assert.equal(sanitizeRedirectValue('/\\evil.com'), '/');
  assert.equal(sanitizeRedirectValue('/\\'), '/');
});

test('sanitizeRedirectValue: path with internal space passes through', () => {
  assert.equal(sanitizeRedirectValue('/foo bar'), '/foo bar');
});

test('sanitizeRedirectValue: non-string input returns /', () => {
  assert.equal(sanitizeRedirectValue(123 as unknown as string), '/');
  assert.equal(sanitizeRedirectValue({} as unknown as string), '/');
});

// --- buildRedirectSearch ---

test('buildRedirectSearch: root path with no search returns empty', () => {
  assert.equal(buildRedirectSearch('/', ''), '');
});

test('buildRedirectSearch: empty pathname returns empty', () => {
  assert.equal(buildRedirectSearch('', ''), '');
});

test('buildRedirectSearch: pathname only', () => {
  assert.equal(buildRedirectSearch('/users', ''), 'redirect=%2Fusers');
});

test('buildRedirectSearch: pathname with query (question mark encoded)', () => {
  assert.equal(
    buildRedirectSearch('/users/123', '?tab=profile'),
    'redirect=%2Fusers%2F123%3Ftab%3Dprofile',
  );
});

test('buildRedirectSearch: query with space', () => {
  assert.equal(
    buildRedirectSearch('/x', '?q=a b'),
    'redirect=%2Fx%3Fq%3Da%20b',
  );
});

test('buildRedirectSearch: query with ampersand is correctly encoded', () => {
  assert.equal(
    buildRedirectSearch('/x', '?q=a&b=c'),
    'redirect=%2Fx%3Fq%3Da%26b%3Dc',
  );
});

test('buildRedirectSearch: empty search string still produces redirect=', () => {
  assert.equal(buildRedirectSearch('/x', ''), 'redirect=%2Fx');
});

test('buildRedirectSearch: non-string pathname returns empty', () => {
  assert.equal(buildRedirectSearch(null as unknown as string, ''), '');
});

test('buildRedirectSearch: protocol-relative pathname is encoded (NOT validated)', () => {
  // The function only encodes; safety validation is the consumer's job.
  assert.equal(
    buildRedirectSearch('//evil.com', ''),
    'redirect=%2F%2Fevil.com',
  );
});
