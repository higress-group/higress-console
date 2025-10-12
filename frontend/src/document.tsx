/**
 * Higress 控制台 HTML 文档配置文件
 * 定义了应用的 HTML 文档结构，包括 meta 标签、标题、样式链接等
 * 这是 ICE 框架的文档入口组件
 */

import { Meta, Title, Links, Main, Scripts } from 'ice';

/**
 * 文档根组件
 * 定义了 HTML 文档的基本结构和元信息
 * @returns 返回完整的 HTML 文档结构
 */
export default function Document() {
  return (
    <html>
      <head>
        {/* 设置文档字符编码为 UTF-8，确保多语言字符正确显示 */}
        <meta charSet="utf-8" />
        
        {/* 设置网站图标，使用 Higress 的 logo */}
        <link rel="icon" href="/higress.jpg" type="image/x-icon" />
        
        {/* 设置视口，确保在移动设备上的响应式显示
            width=device-width: 视口宽度等于设备宽度
            initial-scale=1: 初始缩放比例为 1
            maximum-scale=1: 最大缩放比例为 1
            user-scalable=no: 禁止用户手动缩放 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* ICE 框架的 Meta 组件，用于注入路由相关的 meta 标签 */}
        <Meta />
        
        {/* ICE 框架的 Title 组件，用于注入页面标题 */}
        <Title />
        
        {/* ICE 框架的 Links 组件，用于注入样式表链接 */}
        <Links />
      </head>
      <body>
        {/* ICE 框架的 Main 组件，用于注入应用的主要内容 */}
        <Main />
        
        {/* ICE 框架的 Scripts 组件，用于注入 JavaScript 脚本 */}
        <Scripts />
      </body>
    </html>
  );
}
