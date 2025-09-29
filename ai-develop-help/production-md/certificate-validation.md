# 证书校验功能开发提示词

## 📋 目录索引
- [角色定义](#角色定义)
- [任务描述](#任务描述)
- [输出格式](#输出格式)
- [背景信息](#背景信息)

---

## 角色定义

### Role: 你是一个资深全栈开发工程师，具有丰富的[前端+后端]开发经验，特别擅长证书管理和HTTPS相关功能开发。

---

## 任务描述

### Task: 请帮我添加功能：TLS证书创建时的校验功能

[必选]
1. 需要用到的文件有：
   - `src/pages/tls-certificate/components/TlsCertificateForm/index.tsx` - 证书表单组件
   - `src/services/tls-certificate.ts` - 证书服务接口
   - `src/interfaces/tls-certificate.ts` - 证书接口定义
   - `src/BFF/controllers/tlsCertificateController.js` - BFF证书控制器
   - `src/BFF/routes/tls-certificate.js` - BFF证书路由

2. 具体操作（思路拆解）：
   --最终需求：在证书管理页面中创建证书时增加证书校验功能，避免因上传不正确的证书数据导致HTTPS路由无法正常生效的问题
   --实现步骤：
       1. 在BFF层实现证书校验接口 `/bff/v1/tls-certificates/validate`
       2. 校验逻辑包括：
          - 私钥与证书相匹配验证
          - 证书链完整性验证
          - 证书格式正确性验证
       3. 在前端证书表单组件中，点击确定时先调用校验接口
       4. 校验通过后再调用添加接口，并提示用户验证通过
       5. 校验失败时显示具体错误信息，阻止提交
       6. 在证书服务中添加校验接口调用函数
       7. 更新证书接口定义，添加校验相关的类型定义

[可选]
3. 其他需求：
   - 校验过程需要显示加载状态
   - 错误信息需要国际化支持
   - 校验失败时需要高亮显示错误字段

---

## 输出格式

### Format: 
[必选]
- 该项目的技术栈：`ai-develop-help/Background-information/Technology-stack.md`

- 项目结构：`ai-develop-help/Background-information/Project-structure.md`

- 特殊规范：前端代码尽量少出现中文，必须情况时用翻译文件：`src/locales/zh-CN/translation.json`

- 代码规范：请按照 ICE 配置的 ESLint 文件（通过 getESLintConfig('react-ts') 获取）来修改和规范我的代码，遵循 ICE 默认的规则配置，同时保留下面的自定义规则。eslint文件位于（frontend\.eslintrc.js），需要规范代码的文件位于（frontend\src\app\xxx\xxx.tsx）

---

## 背景信息

### Context: 
[必选]
- 其他需求：第一遍生产的代码在完成功能的情况下尽量简单，不要添加测试文件和README介绍文件。

- AI使用日志：在`ai-develop-help/log`文件夹下面添加AI日志文件。以`ai-develop-help/log/template.log`文件为模板，将AI生成的代码保存为json数据，并保存在log文件夹中。（每天一个日志文件，文件名为日期）

- 日志要求：每一次交互都要记录日志

- 其他补充：当在bff层创建get请求时，注意`src/BFF/summary.md`文件中记录的错误，并修改代码。

[可选]
- 重要补充：
  - 证书校验需要在BFF层实现，因为真实后台没有校验接口
  - 使用Node.js的crypto模块进行证书和私钥验证
  - 校验失败时需要返回详细的错误信息，帮助用户定位问题
  - 支持PEM格式的证书和私钥
  - 需要验证证书链的完整性，确保中间证书不缺失

---

## 技术实现要点

### 证书校验技术要点：
1. **私钥与证书匹配验证**：
   - 使用crypto.createPublicKey()和crypto.createPrivateKey()
   - 比较公钥的模数和指数是否一致

2. **证书链完整性验证**：
   - 解析证书的issuer和subject字段
   - 验证证书链中每个证书的签名
   - 检查是否存在缺失的中间证书

3. **证书格式验证**：
   - 验证PEM格式的正确性
   - 检查证书的基本结构
   - 验证证书的有效期

4. **错误处理**：
   - 提供详细的错误信息
   - 支持国际化错误提示
   - 前端友好的错误展示

---

## 开发注意事项

1. **安全性**：证书校验过程不应暴露敏感信息
2. **性能**：校验过程应该快速响应，避免长时间阻塞
3. **用户体验**：提供清晰的加载状态和错误提示
4. **兼容性**：支持常见的证书格式和私钥格式
5. **可维护性**：代码结构清晰，便于后续扩展和维护
