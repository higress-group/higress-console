# MCP Server 管理功能缺陷修复总结

## 修复内容

### Bug 1: 保存 DB 类型 MCP Server 返回 500 ✅
**文件:** `backend/sdk/src/main/java/com/alibaba/higress/sdk/service/mcp/McpServerConfigMapHelper.java`

**修改:**
- 在 `updateMcpConfig2ConfigMap()` 方法中添加了 `matchList` 的空值检查
- 第 171 行：添加 `if (mcpConfig.getMatchList() != null)` 包裹遍历逻辑
- 第 178 行：添加 `if (mcpConfig.getMatchList() != null)` 包裹删除逻辑

**效果:** 当 `higress-config` 中的 `mcpServer` 对象不包含 `matchList` 属性时，不再抛出 NPE，可以正常保存 DB 类型 MCP Server。

---

### Bug 2 & 4: DB 端口取错 + Nacos 服务未自动填充 ✅
**文件:** `frontend/src/pages/mcp/components/McpFormDrawer.tsx`

**修改 1: 优化自动填充逻辑（第 68-86 行）**
```tsx
// 修改前：
// - 自动填充 db_server_host 和 db_server_port
// - 使用 service.port（服务端口，如 8080）

// 修改后：
// - 只自动填充 db_server_host（从 endpoints 或 domain 获取）
// - 不再自动填充 db_server_port（避免用服务端口覆盖 DB 端口）
// - 兼容 Nacos 服务（优先 endpoints，其次 domain）
```

**修改 2: 表单字段改为可编辑（第 414-445 行）**
```tsx
// 修改前：
<Input disabled placeholder="请先选择后端服务" />

// 修改后：
<Input placeholder="请输入数据库主机地址" />
// 添加必填校验和端口号格式校验（1-65535）
```

**效果:**
- DB 主机地址可以从服务信息自动填充（兼容 static/dns/nacos）
- DB 端口必须由用户手动填写，避免错误使用服务端口
- 解决了 Nacos 服务没有 `endpoints` 字段导致的自动填充失败问题

---

### Bug 3: Nacos 服务 + 直接路由/OpenAPI 类型点确定无反应 ✅
**文件:** `frontend/src/pages/mcp/components/McpFormDrawer.tsx`

**修改 1: 导入 message 组件（第 8 行）**
```tsx
import { Button, Drawer, Form, Input, Select, Space, Switch, message } from 'antd';
```

**修改 2: 添加错误提示（第 200 行）**
```tsx
// 修改前：
if (!service) {
  return;  // 静默失败
}

// 修改后：
if (!service) {
  message.error(t('mcp.form.serviceNotFound') || '未找到对应的后端服务');
  return;
}
```

**效果:** 当服务在 `originalBackendServiceList` 中找不到时，会显示明确的错误提示，而不是静默失败。

---

## 测试建议

### 测试环境准备
1. 准备一个 Higress 环境（2.2.1 + Console 2.2.2-rc.1）
2. 删除 `higress-config` ConfigMap 中的 `mcpServer.matchList` 字段（测试 Bug 1）
3. 准备以下类型的服务：
   - Static 服务（端口 8080）
   - DNS 服务
   - Nacos 服务

### Bug 1 测试步骤
1. 确保 `higress-config` 中 `mcpServer` 对象不包含 `matchList` 属性
2. 创建一个 DB 类型的 MCP Server
3. 验证：不再返回 500 错误，可以正常保存

### Bug 2 测试步骤
1. 使用 Static 服务（端口 8080）创建 DB 类型 MCP Server
2. 手动填写 DB 端口为 3306
3. 保存后验证：`dbConfig.port` 为 3306，而不是 8080

### Bug 3 测试步骤
1. 使用 Nacos 服务创建"直接路由"类型 MCP Server
2. 点击"确定"按钮
3. 验证：如果服务不存在，显示错误提示"未找到对应的后端服务"

### Bug 4 测试步骤
1. 使用 Nacos 服务创建 DB 类型 MCP Server
2. 验证：`db_server_host` 字段可以正常填充（从 `domain` 字段获取）
3. 验证：`db_server_port` 字段为空，需要用户手动填写

---

## 回归测试

### 正常流程测试
1. 使用 Static 服务创建 OpenAPI 类型 MCP Server → 应该成功
2. 使用 DNS 服务创建直接路由类型 MCP Server → 应该成功
3. 使用 Nacos 服务创建 DB 类型 MCP Server → 应该成功
4. 编辑已有的 MCP Server → 应该正常回填数据

### 边界情况测试
1. DB 端口输入非数字 → 应该显示校验错误
2. DB 端口输入 0 或 65536 → 应该显示校验错误
3. 不选择后端服务直接提交 → 应该显示必填校验错误

---

## 潜在风险

1. **DB 端口不再自动填充** - 用户需要手动填写，可能增加操作步骤
   - **缓解措施:** 在表单中添加提示文案，说明 DB 端口需要填写数据库实际端口
   
2. **Nacos 服务数据结构假设** - 假设 Nacos 服务有 `domain` 字段
   - **缓解措施:** 使用可选链 `service.domain || ''`，如果没有则为空字符串

---

## 后续优化建议

1. **增强服务元数据** - 在服务发现时，区分"服务端口"和"数据库端口"
2. **表单提示优化** - 在 DB 配置区域添加说明文案，解释主机和端口的填写规则
3. **国际化补充** - 添加缺失的 i18n key：
   - `mcp.form.serviceNotFound`
   - `mcp.form.dbHostRequired`
   - `mcp.form.dbPortRequired`
   - `mcp.form.dbPortInvalid`
   - `mcp.form.dbHostPlaceholder`
   - `mcp.form.dbPortPlaceholder`

---

## 提交信息建议

```
fix(mcp): 修复 MCP Server 管理功能的 4 个缺陷 (#711)

1. 修复当 mcpServer 对象不包含 matchList 时保存 DB 类型返回 500 的问题
2. 修复 DB 端口错误使用服务端口的问题，改为用户手动填写
3. 修复 Nacos 服务创建直接路由/OpenAPI 类型时静默失败的问题
4. 修复 Nacos 服务创建 DB 类型时主机端口未自动填充的问题

Changes:
- backend: 添加 matchList 空值检查，避免 NPE
- frontend: DB 主机端口改为可编辑，添加校验和错误提示
- frontend: 优化服务查找失败时的用户反馈

Closes #711
```
