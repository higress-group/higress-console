/**
 * 语言切换下拉组件
 * 提供简洁的语言切换功能，支持中文和英文之间的快速切换
 * 点击组件会在当前语言和其他可用语言之间切换
 */

// 导入国际化配置和语言列表
import i18n, { lngs } from '@/i18n';

// 导入 React Hook
import React, { useCallback } from 'react';

// 导入组件样式
import styles from './index.module.css';

/**
 * 语言切换组件属性接口
 * 当前为空接口，组件不需要外部属性
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LanguageDropdownProps {}

/**
 * 语言切换组件
 * 显示当前语言的简短标识，点击可切换到其他可用语言
 * @returns 返回语言切换组件
 */
const LanguageDropdown: React.FC<LanguageDropdownProps> = () => {
  /**
   * 处理语言切换点击事件
   * 在当前语言和其他可用语言之间切换
   * 使用 useCallback 优化性能，避免不必要的重新创建
   */
  const handleMenuClick = useCallback(() => {
    // 查找与当前语言不同的语言配置
    const key = (lngs.find((l) => l.code !== i18n.language) || lngs[0]).code;
    
    // 切换国际化语言
    i18n.changeLanguage(key);
    
    // 将选择的语言保存到本地存储，下次访问时记住选择
    localStorage.setItem('i18nextLng', key);
  }, []);

  // 获取当前语言代码
  const currentLanguage = i18n.language;
  
  // 查找与当前语言不同的语言配置（用于显示切换目标）
  const languageConfig = lngs.find((l) => l.code !== currentLanguage);

  return (
    <span 
      className={`${styles['language-switch']}`} // 应用样式类名
      onClick={handleMenuClick} // 绑定点击事件
    >
      {/* 显示切换目标语言的简短文本，如果没有则显示当前语言 */}
      {languageConfig?.switchText || currentLanguage}
    </span>
  );
};

export default LanguageDropdown;
