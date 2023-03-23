### 功能说明
开源版 WAF 插件(Beta版本)，支持基于 OWASP ModSecurity Core Rule Set (CRS) 的 WAF 规则配置

注意该 WAF 插件性能开销较大，开启全部 CRS 规则后，最小规格的网关实例满负载吞吐只有 600 QPS 左右

### 配置字段
|名称   | 数据类型  | 填写要求  | 默认值  | 描述  |
|---|---|---|---|---|
|  rules | array of string  | 必填  |  - | ModSecurity 规则列表 |

### 配置示例

**观察模式（只会记录日志)**

```yaml
rules:
- "Include @crs-setup-conf"
- "Include @recommended-conf"
- "Include @owasp_crs/*.conf"
- "SecRuleEngine DetectionOnly"
```

**防护模式**

```yaml
rules:
- "Include @crs-setup-conf"
- "Include @recommended-conf"
- "Include @owasp_crs/*.conf"
- "SecRuleEngine on"
```

根据此配置开启插件后，将开启全量CRS规则，更多配置示例请参考：https://github.com/corazawaf/coraza-proxy-wasm

