<h1 align="center">
    <img src="https://img.alicdn.com/imgextra/i2/O1CN01NwxLDd20nxfGBjxmZ_!!6000000006895-2-tps-960-290.png" alt="Higress" width="240" height="72.5">
  <br>
  Gateway Console for Higress
</h1>


Higress Console 用于管理 Higress 的配置规则及其他开箱即用的能力集成，首个可用版本考虑基于 kubernetes 部署环境，预期包含服务管理、路由管理、域名管理等基础能力。
后续规划逐步迭代可观测能力、插件能力、登录管理能力，感兴趣的小伙伴一起Hi~ gress~

## 前置介绍

此项目包含前端、后端（Java）两个部分，前端frontend部分在构建完成后会随着后端代码（SpringBoot）一起部署。

## Quick Start

### Frontend


### Backend

#### 第一步、 配置 Java & Maven 环境

注：建议Jdk版本选择17及以上，Maven版本选择3.8.6及以上。

#### 第二步、 编译 & 镜像

```bash
sh bulid.sh 
#脚本中涉及docker命令，本地调试可注释
```

#### 第三步、 部署 & 启动
```bash
sh start.sh 
```
注：在kubernetes部署需挂载以下内容，用于访问istio的API。

```yaml
    spec:
      containers:
        - volumeMounts:
            - mountPath: /var/run/secrets/access-token
              name: access-token

      volumes:
        - name: access-token
          projected:
            defaultMode: 420
            sources:
              - serviceAccountToken:
                  audience: istio-ca
                  expirationSeconds: 3600
                  path: token
```

#### 第四步、 访问

主页，默认8080端口
```html
localhost:8080
```
swagger，访问swagger页面了解API情况。
```html
swagger：localhost:8080/swagger-ui/index.html
```

## 功能规划

| 功能        |                描述                 |    认领 |
|-----------|:---------------------------------:|------:|
| 服务管理      |    增删改查服务信息，涉及服务模型抽象及相关订阅来源管理。    | 无 |
| 服务管理-服务策略 |    服务相关策略信息，涉及服务转发负载均衡、证书加密等。     | 无 |
| 路由管理      |   增删改查路由信息，涉及路由模型抽象及istio模型的映射。   | 无 |
| 路由管理-路由策略 | 路由级别的流量策略，涉及跨域（cors）、流控、重写、超时重试等。 | 无 |
| 域名管理      |        增删改查域名信息，涉及证书绑定等操作。        |     无 |
| 可观测能力     |    Gateway作为中间件门面，可观测实属看家必备本领。    |     无 |
| 插件能力      |   优秀可扩展的插件能力（或生态）关系着这个中间件能走多远。    |    无 |
| 用户登录能力    |     必要的用户/权限管理集成能力能让技术人感受到关爱。     |    无 |
