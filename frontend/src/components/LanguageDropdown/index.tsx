import i18n, { LANGUAGE_TYPE } from "@/i18n";
import React, { useCallback } from "react";
import styles from "./index.module.css";

interface LanguageDropdownProps {}

const LanguageDropdown: React.FC<LanguageDropdownProps> = () => {
  const handleMenuClick = useCallback(() => {
    const key =
      i18n.language === LANGUAGE_TYPE["zh-CN"]
        ? LANGUAGE_TYPE["en-US"]
        : LANGUAGE_TYPE["zh-CN"];
    i18n.changeLanguage(key);
    localStorage.setItem("i18nextLng", key);
  }, []);

  const currentLanguage = i18n.language;

  return (
    <span className={`${styles["language-switch"]}`} onClick={handleMenuClick}>
      {currentLanguage === LANGUAGE_TYPE["zh-CN"] ? "En" : "中"}
    </span>
  );
};

export default LanguageDropdown;
