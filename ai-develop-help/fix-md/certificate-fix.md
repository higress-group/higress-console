# 错误排查请求（前端项目）

## 场景 (可选)
```
```

## 出现的问题 (必选)
```
1. 证书验证出现问题，可以验证证书的格式和完整性，但是验证不了两个不匹配的证书数据。（已完成）
2.错误反馈的提示没有显示出错误的原因（已完成）
3.修复验证证书链完整性功能（已完成）

```

## 报错原因分析 (可选)
### 注：若没写则由AI自己检查后填写，若有填写则按照填写的思路检查修改错误
### 开发者判断的错误原因
```
问题一：当证书数据和私钥数据不匹配但是完整时，验证器会返回验证成功，但是实际上不匹配。（已完成）

问题二：验证证书链完整性的功能有问题，即使crt证书的证书链不完整，验证器也会返回验证成功。（仿照C:\Users\35334\Desktop\higress-note\certificate\wrong-test\check_match.cjs 测试程序中对证书链完整性验证的代码）

```

### AI判断的错误原因
```
```

### 具体修改文件列表 (可选)
1. src\BFF\controllers\tlsCertificateController.js 修改证书验证接口
2. src\BFF\controllers\tlsCertificateController.js 修改证书链完整性验证接口

## 补充内容
1. 记录日志到ai-develop-help\log文件夹中今天的日期文件（每一次交互都要记录日志）
2. 代码规范：请按照 ICE 配置的 ESLint 文件（通过 getESLintConfig('react-ts') 获取）来修改和规范我的代码，遵循 ICE 默认的规则配置，同时保留下面的自定义规则。eslint文件位于（frontend\.eslintrc.js），需要规范代码的文件位于（frontend\src\app\xxx\xxx.tsx）
3. 若有bff层相关错误，可以读取 src\BFF\Error-summary.md 文件中记录的错误