import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    fallbackLng: "zh-CN",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;

export const lngs = [
  { code: "zh-CN", nativeName: "简体中文", switchText: "中", officialSiteCode: "zh-cn" },
  { code: "en-US", nativeName: "English (United States)", switchText: "En", officialSiteCode: "en-us" },
];
