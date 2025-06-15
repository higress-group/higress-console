const modelMapping2String = (modelMapping?: { [key: string]: string }): string => {
  if (!modelMapping) {
    return '';
  }
  if (typeof modelMapping === 'string') {
    // If modelMapping is a string, return it directly.
    return modelMapping;
  }
  const entries = Object.entries(modelMapping);
  if (entries.length === 0) {
    return '';
  }
  if (entries.length === 1 && entries[0][0] === '*') {
    // Only one entry with key '*', return the value directly.
    return entries[0][1];
  }
  let result = '';
  for (const [key, value] of Object.entries(modelMapping)) {
    if (!key) {
      continue;
    }
    if (result) {
      result += ';';
    }
    result += `${key}=${value}`;
  }
  return result;
};

const string2ModelMapping = (str?: string): { [key: string]: string } => {
  if (!str) {
    return {};
  }
  const modelMapping = {};
  if (str.indexOf(';') === -1 && str.indexOf('=') === -1) {
    // If the string does not contain ';' or '=', treat it as a single value for '*'.
    modelMapping['*'] = str.trim();
  } else {
    const pairs = str.split(';');
    for (const pair of pairs) {
      const [key, value] = pair.split('=', 2);
      if (!key) {
        continue; // Skip invalid pairs
      }
      modelMapping[key.trim()] = value.trim();
    }
  }
  return modelMapping;
};

export {
  modelMapping2String,
  string2ModelMapping,
}
