import i18n, { LANGUAGE_TYPE } from "@/i18n";
import React from "react";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { GithubOutlined } from "@ant-design/icons";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { t } = useTranslation();

  const linkList = useMemo(() => {
    const langStr =
      i18n.language === LANGUAGE_TYPE["zh-CN"] ? "zh-cn" : "en-us";
    return [
      {
        name: t("misc.homepage"),
        link: `https://higress.io/${langStr}/index.html`,
      },
      {
        name: t("misc.docs"),
        link: `https://higress.io/${langStr}/docs/overview/what-is-higress.html`,
      },
      {
        name: t("misc.developers"),
        link: `https://higress.io/${langStr}/docs/developers/developers_dev.html`,
      },
      {
        name: t("misc.blog"),
        link: `https://higress.io/${langStr}/blog/index.html`,
      },
      {
        name: t("misc.community"),
        link: `https://higress.io/${langStr}/community/index.html`,
      },
      {
        name: t("misc.download"),
        link: "https://github.com/alibaba/higress/releases",
      },
      // {
      //   name:  t("misc.demo"),
      //   link: "http://demo.higress.io/route",
      // },
    ];
  }, [i18n.language]);
  return (
    <ul className={styles["header-nav-bar"]}>
      {linkList.map((item) => {
        return (
          <li key={item.link}>
            <a href={item.link} target="_blank">
              {item.name}
            </a>
          </li>
        );
      })}
      <li>
        <a href="https://github.com/alibaba/higress" target="_blank">
          <GithubOutlined style={{ fontSize: "16px" }} />
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
