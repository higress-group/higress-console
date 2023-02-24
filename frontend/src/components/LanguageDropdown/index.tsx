import i18n, { lngs } from "@/i18n";
import React, { useCallback } from "react";
import styles from "./index.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LanguageDropdownProps { }

const LanguageDropdown: React.FC<LanguageDropdownProps> = () => {
  const handleMenuClick = useCallback(() => {
    const key = (lngs.find(l => l.code !== i18n.language) || lngs[0]).code;
    i18n.changeLanguage(key);
    localStorage.setItem("i18nextLng", key);
  }, []);

  const currentLanguage = i18n.language;
  const languageConfig = lngs.find(l => l.code === currentLanguage);

  return (
    <span className={`${styles["language-switch"]}`} onClick={handleMenuClick}>
      {languageConfig?.switchText || currentLanguage}
    </span>
  );
};

export default LanguageDropdown;
