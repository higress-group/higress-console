/**
 * 页脚组件
 * 显示在页面底部的版权信息和系统版本号
 * 包含当前年份、Higress 名称和系统版本
 */

// 导入全局状态管理
import store from '@/store';

/**
 * 页脚组件
 * 显示版权信息和系统版本
 * @returns 返回页脚组件
 */
const Footer: React.FC = () => {
  // 获取当前年份
  const currentYear = new Date().getFullYear();
  
  // 获取系统状态
  const [systemState] = store.useModel('system');

  return (
    <div style={{ 
      textAlign: 'center', // 文本居中对齐
      margin: 10            // 外边距 10px
    }}>
      {/* 版权信息 */}
      &copy; {currentYear} Higress
      
      {/* 系统版本信息 */}
      {
        systemState.version && (
          <>
            <br /> {/* 换行 */}
            v{systemState.version} {/* 显示版本号 */}
          </>
        )
      }
    </div>
  );
};

export default Footer;
