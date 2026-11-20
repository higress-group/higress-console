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

export function resolveConsumerKeyAuthPayload(
  values: Array<string | null | undefined> | null | undefined,
  editing: boolean,
  clearRequested = false,
): { values: string[] | null; append: boolean } {
  const resolvedValues = resolveWriteOnlyList(values, clearRequested);
  return {
    values: resolvedValues,
    append: Boolean(editing && resolvedValues?.length && !clearRequested),
  };
}

export function resolveWriteOnlyScalar(value: string | null | undefined, clearRequested = false): string | null {
  if (clearRequested) {
    return '';
  }
  return value || null;
}
