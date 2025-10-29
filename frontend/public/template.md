# 路由批量导入模板

## 使用说明

本模板用于批量导入路由配置。请按照以下JSON格式填写路由信息：

```json
[
  {
    "name": "route-example-1",
    "domains": ["example.com"],
    "path": {
      "matchType": "PRE",
      "matchValue": "/api/v1",
      "caseSensitive": true
    },
    "methods": ["GET", "POST"],
    "headers": [],
    "urlParams": [],
    "services": ["service-example-1"],
    "customConfigs": {},
    "authConfig": {
      "enabled": false,
      "allowedConsumers": []
    }
  },
  {
    "name": "route-example-2",
    "domains": ["api.example.com"],
    "path": {
      "matchType": "EQUAL",
      "matchValue": "/user/profile",
      "caseSensitive": true
    },
    "methods": ["GET"],
    "headers": [],
    "urlParams": [],
    "services": ["service-example-2"],
    "customConfigs": {},
    "authConfig": {
      "enabled": false,
      "allowedConsumers": []
    }
  }
]
```

## 字段说明

- **name**: 路由名称，支持小写字母、数字和特殊字符(- .)，不能以特殊字符开头和结尾
- **domains**: 域名列表，支持多个域名
- **path**: 路径匹配规则
  - **matchType**: 匹配类型，支持 PRE(前缀匹配)、EQUAL(精确匹配)、REGULAR(正则匹配)
  - **matchValue**: 匹配值
  - **caseSensitive**: 是否区分大小写
- **methods**: HTTP方法列表，如 ["GET", "POST"]
- **headers**: 请求头匹配规则列表
- **urlParams**: URL参数匹配规则列表
- **services**: 目标服务列表
- **customConfigs**: 自定义配置对象
- **authConfig**: 认证配置
  - **enabled**: 是否启用认证
  - **allowedConsumers**: 允许访问的消费者列表

## 注意事项

1. 请确保路由名称在系统中唯一
2. 服务名称必须是已存在的服务
3. 域名必须是已配置的域名
4. 文件必须是有效的JSON格式
5. 建议先导出现有路由作为参考
