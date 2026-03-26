import i18n from "@/i18n";
import { getOfficialSiteLink } from "@/utils";
import { GithubOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

const COMMERCIAL_URL_ZH = "https://www.aliyun.com/product/apigateway?spm=higress-console.topbar.0.0.0";
const COMMERCIAL_URL_EN = "https://www.alibabacloud.com/en/product/api-gateway?spm=higress-console.topbar.0.0.0";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {
  const { t } = useTranslation();

  const lang = i18n.language;

  const linkList = useMemo(() => {
    return [
      {
        name: t("navbar.officialWebsite"),
        link: `${getOfficialSiteLink("/")}`,
      },
      {
        name: t("navbar.docs"),
        link: `${getOfficialSiteLink("/docs/latest/overview/what-is-higress")}`,
      },
      {
        name: t("navbar.commercial"),
        link: `${i18n.language.startsWith("zh") ? COMMERCIAL_URL_ZH : COMMERCIAL_URL_EN}`,
      },
      {
        name: t("navbar.developers"),
        link: `${getOfficialSiteLink("/docs/developers/developers_dev/")}`,
      },
      {
        name: t("navbar.blog"),
        link: `${getOfficialSiteLink("/blog/")}`,
      },
      {
        name: t("navbar.download"),
        link: "https://github.com/alibaba/higress/releases",
      },
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
