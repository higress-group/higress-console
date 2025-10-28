# 错误排查请求

## 开发者使用介绍

1. 填写出现的问题
2. 选填错误原因分析（如果自己分析出来可以直接填写，比 AI 分析的效果更好）
3. 选填具体修改的文件列表（填写将显著提升 AI 的效果）
4. 补充内容前三行不用动，如无特殊需求可忽略
5. 提交 AI 修改错误

## 场景

1. 当点击开启dubbo协议转换时报错

## 出现的问题

1. 服务分组选择框是空的（服务来源和服务接口名都有，是不是数据格式判断错误，或者是漏了字段？）（已解决，帮忙删除log打印代码）
2. 点击确定以后项目没有部署（好像只调用了routes/httproute-http2rpc-ingress接口，没有调用部署接口）（解决）
3. 报错http://localhost:3000/bff/v1/routes/httproute-http2rpc-ingress/dubbo-config（502 Bad Gateway）;http://localhost:3000/api/v1/routes/httproute-http2rpc-ingress/dubbo-config（404 Not Found）
4. 当参数类型为param或paramFromEntireBody后还有一些配置参数要填（参考frontend\public\http2rpc-config.yaml中的相关配置）（已解决）


## 报错原因分析

**注：若没写则由 AI 自己检查后填写，若有填写则按照填写的思路检查修改错误**

### 开发者判断的错误原因

1. 



### AI 判断的错误原因

1.

### 具体修改文件列表

1. 

## 补充内容

1. 记录日志到 ai-develop-help\log 文件夹中今天的日期文件（每一次交互都要记录日志）
2. 代码规范：请按照 ICE 配置的 ESLint 文件（通过 getESLintConfig('react-ts') 获取）来修改和规范我的代码，遵循 ICE 默认的规则配置，同时保留下面的自定义规则。eslint 文件位于（frontend.eslintrc.js），需要规范代码的文件位于（frontend\src\app\xxx\xxx.tsx）
3. 若有 BFF 层相关错误，可以读取 src\BFF\Error-summary 文件中记录的错误

---