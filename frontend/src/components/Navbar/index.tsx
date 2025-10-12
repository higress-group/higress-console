/**
 * 导航栏组件
 * 显示 Higress 相关的导航链接，包括官网、文档、社区等
 * 支持多语言，根据当前语言显示对应语言版本的链接
 */

// 导入国际化配置和语言列表
import i18n, { lngs } from "@/i18n";

// 导入 GitHub 图标
import { GithubOutlined } from "@ant-design/icons";

// 导入 React Hook
import React, { useMemo } from "react";

// 导入国际化 Hook
import { useTranslation } from "react-i18next";

// 导入组件样式
import styles from "./index.module.css";

/**
 * 导航栏组件属性接口
 * 当前为空接口，组件不需要外部属性
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavbarProps {}

/**
 * 导航栏组件
 * 显示 Higress 相关的导航链接列表
 * @returns 返回导航栏组件
 */
const Navbar: React.FC<NavbarProps> = () => {
  // 获取国际化翻译函数
  const { t } = useTranslation();

  /**
   * 计算导航链接列表
   * 根据当前语言环境生成对应语言版本的链接
   * 使用 useMemo 优化性能，避免重复计算
   */
  const linkList = useMemo(() => {
    // 获取当前语言代码
    const lang = i18n.language;
    
    // 查找当前语言的配置
    const langConfig = lngs.find(l => l.code === lang);
    
    // 获取官网语言代码，如果没有则使用当前语言的小写形式
    const officialSiteLang = langConfig?.officialSiteCode || lang.toLowerCase();
    
    // 返回导航链接列表
    return [
      {
        name: t("navbar.officialWebsite"), // 官网链接文本（国际化）
        link: `https://higress.io/${officialSiteLang}/`, // 对应语言版本的官网
      },
      {
        name: t("navbar.docs"), // 文档链接文本（国际化）
        link: `https://higress.io/${officialSiteLang}/docs/overview/what-is-higress/`, // 对应语言版本的文档
      },
      {
        name: t("navbar.commercial"), // 商业版链接文本（国际化）
        link: `https://www.aliyun.com/product/apigateway?spm=higress-console.topbar.0.0.0`, // 阿里云产品页面
      },
      {
        name: t("navbar.developers"), // 开发者链接文本（国际化）
        link: `https://higress.io/${officialSiteLang}/docs/developers/developers_dev/`, // 对应语言版本的开发者文档
      },
      {
        name: t("navbar.blog"), // 博客链接文本（国际化）
        link: `https://higress.io/${officialSiteLang}/blog/`, // 对应语言版本的博客
      },
      {
        name: t("navbar.community"), // 社区链接文本（国际化）
        link: `https://higress.io/${officialSiteLang}/community/`, // 对应语言版本的社区页面
      },
      {
        name: t("navbar.download"), // 下载链接文本（国际化）
        link: "https://github.com/alibaba/higress/releases", // GitHub 发布页面
      },
    ];
  }, [i18n.language]); // 依赖：当语言改变时重新计算

  return (
    <ul className={styles["header-nav-bar"]}>
      {/* 渲染导航链接列表 */}
      {linkList.map((item) => {
        return (
          <li key={item.link}>
            {/* 在新窗口中打开链接 */}
            <a href={item.link} target="_blank">
              {item.name}
            </a>
          </li>
        );
      })}
      
      {/* GitHub 链接 */}
      <li>
        <a href="https://github.com/alibaba/higress" target="_blank">
          <GithubOutlined style={{ fontSize: "16px" }} /> {/* GitHub 图标 */}
        </a>
      </li>
    </ul>
  );
};

export default Navbar;
