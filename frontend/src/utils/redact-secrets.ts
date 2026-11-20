export const REDACTED_VALUE = '[REDACTED]';

const SECRET_KEY_NAMES = new Set([
  'tokens',
  'token',
  'apitokens',
  'apitoken',
  'awsaccesskey',
  'awssecretkey',
  'vertexauthkey',
  'values',
  'authorization',
  'cookie',
  'setcookie',
  'password',
  'clientsecret',
  'privatekey',
  'apikey',
  'xapikey',
  'accesstoken',
  'refreshtoken',
  'idtoken',
]);

const SENSITIVE_JSON_KEY_PATTERN =
  /"(tokens?|api[-_]?tokens?|awsAccessKey|awsSecretKey|vertexAuthKey|values|authorization|password)"\s*:/i;

const MAX_DEPTH = 12;

function normalizeKey(key: string): string {
  return key.replace(/[-_\s]/g, '').toLowerCase();
}

function isSecretKey(key: string): boolean {
  const normalized = normalizeKey(key);
  return SECRET_KEY_NAMES.has(normalized) || normalized.endsWith('authorization');
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function redactJsonString(value: string, depth: number, seen: WeakSet<object>): string {
  if (!SENSITIVE_JSON_KEY_PATTERN.test(value)) {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return value;
  }
  try {
    return JSON.stringify(redactValue(JSON.parse(trimmed), depth + 1, seen));
  } catch {
    // Keep non-JSON and malformed messages intact.
    return value;
  }
}

function redactValue(value: unknown, depth: number, seen: WeakSet<object>): unknown {
  if (value === null || typeof value === 'undefined') {
    return value;
  }
  if (typeof value === 'string') {
    return redactJsonString(value, depth, seen);
  }
  if (typeof value !== 'object') {
    return value;
  }
  if (depth > MAX_DEPTH) {
    return value;
  }
  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.map(item => redactValue(item, depth + 1, seen));
  }
  if (value instanceof Date) {
    return value;
  }
  if (!isPlainObject(value)) {
    return value;
  }

  const redacted: Record<string, unknown> = {};
  Object.keys(value).forEach((key) => {
    if (isSecretKey(key)) {
      redacted[key] = REDACTED_VALUE;
      return;
    }
    redacted[key] = redactValue(value[key], depth + 1, seen);
  });
  return redacted;
}

export function redactSensitiveData<T>(value: T): T {
  return redactValue(value, 0, new WeakSet<object>()) as T;
}

export function redactForLog(value: unknown): unknown {
  if (!(value instanceof Error)) {
    return redactSensitiveData(value);
  }

  const redacted: Record<string, unknown> = {
    name: value.name,
    message: value.message,
    stack: value.stack,
  };
  Object.keys(value).forEach((key) => {
    const child = (value as unknown as Record<string, unknown>)[key];
    redacted[key] = isSecretKey(key) ? REDACTED_VALUE : redactSensitiveData(child);
  });
  return redacted;
}
