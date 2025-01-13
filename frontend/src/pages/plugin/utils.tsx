import i18n from "@/i18n";

export enum QueryType {
  ROUTE = 'route',
  DOMAIN = 'domain',
  AI_ROUTE = 'aiRoute',
}

export function getI18nValue(obj: object, key: string) {
  if (!obj) {
    return null;
  }
  const i18nMap = obj[`x-${key}-i18n`];
  if (i18nMap) {
    const i18nValue = i18nMap[i18n.language];
    if (i18nValue) {
      return i18nValue;
    }
  }
  return obj[key];
}
