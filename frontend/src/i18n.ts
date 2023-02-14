import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import translation_en from "@/locales/en-US/translation.json";
import translation_zh from "@/locales/zh-CN/translation.json";

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
    resources: {
      en: {
        translation: translation_en,
      },
      zh: {
        translation: translation_zh,
      },
    },
  });

export default i18n;

export const lngs = [
  {
    code: "zh-CN",
    nativeName: "简体中文",
    switchText: "中",
    officialSiteCode: "zh-cn",
  },
  {
    code: "en-US",
    nativeName: "English (United States)",
    switchText: "En",
    officialSiteCode: "en-us",
  },
];
