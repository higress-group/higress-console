# MCP Server 管理功能缺陷修复计划

## Issue #711 - 4 个 Bug 分析与修复方案

### Bug 1: 保存 DB 类型 MCP Server 返回 500
**问题:** 当 `higress-config` 中的 `mcpServer` 对象不包含 `matchList` 属性时，保存会报 500 错误

**根因:** `McpServerConfigMapHelper.updateMcpConfig2ConfigMap()` 方法第 171 行：
```java
for (McpServerConfigMap.MatchList obj : mcpConfig.getMatchList()) {
```
当 `mcpConfig.getMatchList()` 返回 `null` 时，会抛出 NPE。

**修复位置:** `backend/sdk/src/main/java/com/alibaba/higress/sdk/service/mcp/McpServerConfigMapHelper.java`

**修复方案:**
```java
// 第 171 行之前添加空值检查
if (mcpConfig.getMatchList() != null) {
    for (McpServerConfigMap.MatchList obj : mcpConfig.getMatchList()) {
        // ... 现有逻辑
    }
}
```

同时需要检查第 178 行的 `mcpConfig.getMatchList().stream()` 也需要空值保护。

---

### Bug 2: DB 端口取错
**问题:** 使用 static 或 dns 类型的服务配置 DB 类型 MCP Server 时，数据库端口错误地使用了服务的端口，而不是 DB 实例实际的端口

**根因:** 前端 `McpFormDrawer.tsx` 第 68-76 行：
```tsx
useEffect(() => {
  if (!selectedService) return;
  const serviceName = selectedService.split(':')[0];
  const service = originalBackendServiceList.find((item) => item.name === serviceName);
  if (service) {
    form.setFieldsValue({
      db_server_host: service.endpoints?.[0] || '-',
      db_server_port: service.port || '-',  // ❌ 这里用了服务端口
    });
  }
}, [originalBackendServiceList, selectedService]);
```

**修复位置:** `frontend/src/pages/mcp/components/McpFormDrawer.tsx`

**修复方案:**
- DB 类型的 `db_server_host` 和 `db_server_port` 应该由用户手动填写，不应该自动从服务信息中填充
- 或者，如果服务有 DB 端口的元数据，应该从正确的字段读取

**建议方案:** 删除这个 useEffect，让用户手动填写 DB 的实际主机和端口。

---

### Bug 3: Nacos 服务 + 直接路由/OpenAPI 类型点确定无反应
**问题:** 使用从 Nacos 发现的服务配置"直接路由"或"OpenAPI"类型的 MCP Server 时，点击"确定"按钮没有任何响应

**根因:** 前端 `McpFormDrawer.tsx` 第 189-195 行：
```tsx
const handleFinish = (values: any) => {
  let serviceName: string;
  let service: any;

  // 根据服务类型确定使用哪个服务字段
  if (values.type === SERVICE_TYPE.DIRECT_ROUTE) {
    serviceName = values.directRoute_service?.split(':')[0];
  } else {
    serviceName = values.service?.split(':')[0];
  }

  service = originalBackendServiceList.find((item) => item.name === serviceName);
  if (!service) {
    return;  // ❌ 静默失败，没有任何提示
  }
```

当从 Nacos 发现的服务在 `originalBackendServiceList` 中找不到时，直接 `return` 导致表单提交失败但没有任何错误提示。

**修复位置:** `frontend/src/pages/mcp/components/McpFormDrawer.tsx`

**修复方案:**
```tsx
if (!service) {
  message.error(t('mcp.form.serviceNotFound'));
  return;
}
```

或者，检查 Nacos 服务是否正确加载到 `originalBackendServiceList` 中。

---

### Bug 4: Nacos 服务 + DB 类型未自动填充主机端口
**问题:** 使用从 Nacos 发现的服务配置 DB 类型 MCP Server 时，数据库主机和端口信息没有自动填充到表单中

**根因:** 与 Bug 2 相同的 useEffect（第 68-76 行），但 Nacos 服务可能没有 `endpoints` 字段或格式不同

**修复位置:** `frontend/src/pages/mcp/components/McpFormDrawer.tsx`

**修复方案:**
- 如果要保留自动填充功能，需要兼容 Nacos 服务的数据结构
- 建议方案：删除自动填充逻辑，让用户手动填写（与 Bug 2 的修复一致）

---

## 修复优先级

1. **Bug 1 (高)** - 500 错误，影响核心功能
2. **Bug 3 (高)** - 静默失败，用户体验差
3. **Bug 2 (中)** - 数据错误，但用户可以手动修改
4. **Bug 4 (中)** - 便利性问题，不影响功能

---

## 测试计划

### Bug 1 测试
1. 删除 `higress-config` ConfigMap 中的 `mcpServer.matchList` 字段
2. 尝试创建 DB 类型 MCP Server
3. 验证不再返回 500 错误

### Bug 2 & 4 测试
1. 使用 static 类型服务（端口 8080）创建 DB 类型 MCP Server（实际 DB 端口 3306）
2. 验证 `db_server_port` 字段不会被错误填充为 8080
3. 使用 Nacos 服务重复测试

### Bug 3 测试
1. 使用 Nacos 服务创建"直接路由"类型 MCP Server
2. 点击"确定"按钮
3. 验证有明确的错误提示（如果服务不存在）或成功提交

---

## 相关文件清单

### 后端
- `backend/sdk/src/main/java/com/alibaba/higress/sdk/service/mcp/McpServerConfigMapHelper.java`

### 前端
- `frontend/src/pages/mcp/components/McpFormDrawer.tsx`
