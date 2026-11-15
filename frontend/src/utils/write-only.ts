export function resolveWriteOnlyList(
  values: Array<string | null | undefined> | null | undefined,
  clearRequested = false,
): string[] | null {
  if (clearRequested) {
    return [];
  }
  const replacements = (values || []).filter((value): value is string => typeof value === 'string' && value.length > 0);
  return replacements.length > 0 ? replacements : null;
}

export function resolveWriteOnlyScalar(value: string | null | undefined, clearRequested = false): string | null {
  if (clearRequested) {
    return '';
  }
  return value || null;
}

export function resolveConsumerFormInitialValues(value: any): object | null {
  if (!value) {
    return null;
  }
  const credentials = {};
  for (const credential of value.credentials || []) {
    credentials[credential.type] = { ...credential, values: [] };
  }
  return { ...value, credentials };
}

export function resolveConsumerKeyAuthPayload(
  values: Array<string | null | undefined> | null | undefined,
  editing: boolean,
  clearRequested = false,
): { values?: string[] | null; additionalValues?: string[] } {
  const resolvedValues = resolveWriteOnlyList(values, clearRequested);
  if (!editing) {
    return { values: resolvedValues };
  }
  if (clearRequested) {
    return { values: [] };
  }
  return { additionalValues: resolvedValues || [] };
}
