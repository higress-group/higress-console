/**
 * Higress 控制台国际化配置文件
 * 配置多语言支持，包括中文和英文
 */

// 导入 i18next 核心库及其插件
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";  // 浏览器语言检测插件
import HttpApi from "i18next-http-backend";  // HTTP 后端插件，用于动态加载翻译文件
import { initReactI18next } from "react-i18next";  // React 集成插件

// 导入本地翻译文件
import translation_en from "@/locales/en-US/translation.json";
import translation_zh from "@/locales/zh-CN/translation.json";

/**
 * 初始化 i18next 配置
 * 设置语言检测、翻译资源和 React 集成
 */
i18n
  .use(HttpApi)  // 使用 HTTP 后端插件，支持从服务器动态加载翻译
  .use(LanguageDetector)  // 使用浏览器语言检测，自动识别用户语言偏好
  .use(initReactI18next)  // 将 i18n 传递给 react-i18next，实现 React 组件的国际化
  .init({
    debug: false,  // 关闭调试模式，生产环境建议设为 false
    fallbackLng: "zh-CN",  // 回退语言，当检测不到用户语言时使用简体中文
    interpolation: {
      escapeValue: false,  // React 已经防止了 XSS 攻击，不需要额外转义
      // 参考文档：https://www.i18next.com/translation-function/interpolation#unescape
    },
    // 定义可用的翻译资源
    resources: {
      en: {
        translation: translation_en,  // 英文翻译资源
      },
      zh: {
        translation: translation_zh,  // 中文翻译资源
      },
    },
  });

// 导出配置好的 i18n 实例，供应用其他部分使用
export default i18n;

/**
 * 支持的语言列表配置
 * 定义了应用支持的语言及其相关属性
 */
export const lngs = [
  {
    code: "zh-CN",  // 语言代码
    nativeName: "简体中文",  // 本地语言名称
    switchText: "中",  // 语言切换按钮显示的文本
    officialSiteCode: "zh-cn",  // 官网语言代码
  },
  {
    code: "en-US",  // 语言代码
    nativeName: "English (United States)",  // 本地语言名称
    switchText: "En",  // 语言切换按钮显示的文本
    officialSiteCode: "en-us",  // 官网语言代码
  },
];
