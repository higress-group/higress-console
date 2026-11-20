const CONFIG_DRAFT_STORAGE_KEY_PREFIX = 'higress-console.system.config-draft';

export const getConfigDraftStorageKey = (username: string): string =>
  `${CONFIG_DRAFT_STORAGE_KEY_PREFIX}.${encodeURIComponent(username)}`;

export const clearConfigDraft = (username?: string): void => {
  if (username) {
    sessionStorage.removeItem(getConfigDraftStorageKey(username));
  }
};
