# 项目结构

## 开发者须知（AI无需阅读）

1. 本文为后端项目结构文件

## 📋 目录索引

- [模块依赖关系](#模块依赖关系)
- [基础项目结构](#基础项目结构)
- [console模块结构](#console模块结构)
- [sdk模块结构](#sdk模块结构)
- [核心配置文件说明](#核心配置文件说明)
- [补充说明](#补充说明)

## 模块依赖关系

### 核心依赖关系

- **console/** ↔ **sdk/** 
  - console模块依赖sdk模块，提供Web API接口
  - 数据流向：前端请求 → console → sdk → Kubernetes API

- **sdk/** → **Kubernetes Client**
  - SDK模块直接与Kubernetes集群交互
  - 数据流向：SDK → Kubernetes Client → K8s API Server

### 详细依赖说明

#### 后端模块依赖

```
console/ (Web应用层)
  ↓ 依赖
sdk/ (核心业务层)
  ↓ 使用
Kubernetes Client (基础设施层)
  ↓ 调用
Kubernetes API Server (集群资源)
```

#### 数据流向

```
前端请求 → Controller → Service → SDK Service → Kubernetes Client
    ↓         ↓         ↓           ↓              ↓
  REST API  业务逻辑   核心功能    K8s集成      集群资源操作
```

#### 开发流程依赖

1. **新增功能流程**：
   - `sdk/model/` → 定义数据模型
   - `sdk/service/` → 实现业务逻辑
   - `console/controller/` → 创建REST API
   - `console/service/` → 实现Web层业务逻辑

2. **Kubernetes集成流程**：
   - `sdk/service/kubernetes/` → K8s客户端封装
   - `sdk/model/` → CRD资源模型
   - `sdk/service/` → 业务服务实现

## 基础项目结构

```
backend/
├── console/                           # Web应用模块
│   ├── src/main/java/                 # Java源代码
│   ├── src/main/resources/            # 资源文件
│   ├── src/test/java/                 # 测试代码
│   └── pom.xml                       # Maven配置
├── sdk/                              # 核心SDK模块
│   ├── src/main/java/                # Java源代码
│   ├── src/main/resources/           # 资源文件
│   ├── src/test/java/                # 测试代码
│   └── pom.xml                       # Maven配置
├── tools/                            # 工具和脚本
│   ├── mcp/                          # MCP服务工具
│   └── openapiToMcpserver.sh         # OpenAPI转换脚本
├── style/                            # 代码规范配置
│   ├── copyright                     # 版权声明
│   ├── higress_checkstyle.xml        # Checkstyle配置
│   ├── higress_formatter.xml         # 代码格式化配置
│   └── higress_suppressions.xml      # 检查抑制配置
├── pom.xml                           # 父级Maven配置
├── Dockerfile                        # Docker镜像配置
├── start.sh                          # 启动脚本
├── build.sh                          # 构建脚本
├── mvnw                              # Maven Wrapper (Unix)
└── mvnw.cmd                          # Maven Wrapper (Windows)
```

## console模块结构

```
console/src/main/java/com/alibaba/higress/console/
├── aop/                              # 切面编程
│   └── ApiStandardizationAspect.java # API标准化切面
├── client/                           # 外部客户端
│   └── grafana/                      # Grafana客户端
│       ├── GrafanaClient.java        # Grafana客户端
│       ├── GrafanaService.java       # Grafana服务
│       └── models/                   # Grafana数据模型
├── config/                           # 配置类
│   ├── SdkConfig.java                # SDK配置
│   └── SwaggerConfig.java            # Swagger配置
├── constant/                         # 常量定义
│   ├── CapabilityKey.java            # 能力键常量
│   ├── SystemConfigKey.java          # 系统配置键
│   └── UserConfigKey.java           # 用户配置键
├── context/                          # 上下文
│   └── HttpContext.java              # HTTP上下文
├── controller/                       # 控制器层
│   ├── ai/                           # AI相关控制器
│   │   ├── AiRoutesController.java   # AI路由控制器
│   │   └── LlmProvidersController.java # LLM提供商控制器
│   ├── mcp/                          # MCP相关控制器
│   │   └── McpServerController.java  # MCP服务器控制器
│   ├── dto/                          # 数据传输对象
│   │   ├── ChangePasswordRequest.java # 修改密码请求
│   │   ├── LoginRequest.java         # 登录请求
│   │   ├── PaginatedResponse.java    # 分页响应
│   │   ├── Response.java             # 通用响应
│   │   └── SystemInitRequest.java    # 系统初始化请求
│   ├── exception/                    # 异常处理
│   │   └── AuthException.java        # 认证异常
│   ├── util/                         # 工具类
│   │   └── ControllerUtil.java       # 控制器工具
│   ├── AiProxyController.java        # AI代理控制器
│   ├── ConsumersController.java      # 消费者控制器
│   ├── DashboardController.java      # 仪表板控制器
│   ├── DomainsController.java        # 域名控制器
│   ├── GrafanaController.java        # Grafana控制器
│   ├── HealthzController.java        # 健康检查控制器
│   ├── LandingController.java        # 首页控制器
│   ├── ProxyServerController.java    # 代理服务器控制器
│   ├── RoutesController.java         # 路由控制器
│   ├── ServicesController.java       # 服务控制器
│   ├── ServiceSourceController.java # 服务源控制器
│   ├── SessionController.java        # 会话控制器
│   ├── SystemController.java         # 系统控制器
│   ├── TlsCertificatesController.java # TLS证书控制器
│   ├── UserController.java           # 用户控制器
│   ├── WasmPluginInstancesController.java # WASM插件实例控制器
│   └── WasmPluginsController.java    # WASM插件控制器
├── model/                            # 数据模型
│   ├── DashboardInfo.java            # 仪表板信息
│   ├── DashboardType.java            # 仪表板类型
│   ├── SystemInfo.java               # 系统信息
│   └── User.java                     # 用户模型
├── service/                          # 服务层
│   ├── ConfigService.java            # 配置服务接口
│   ├── ConfigServiceImpl.java        # 配置服务实现
│   ├── DashboardService.java         # 仪表板服务接口
│   ├── DashboardServiceImpl.java     # 仪表板服务实现
│   ├── SessionService.java          # 会话服务接口
│   ├── SessionServiceImpl.java      # 会话服务实现
│   ├── SessionUserHelper.java       # 会话用户助手
│   ├── SystemService.java            # 系统服务接口
│   └── SystemServiceImpl.java       # 系统服务实现
├── util/                             # 工具类
│   ├── AesUtil.java                  # AES加密工具
│   └── CertificateUtil.java         # 证书工具
├── HigressConsoleApplication.java    # 主应用类
└── WebMvcInitializer.java           # Web MVC初始化器
```

## sdk模块结构

```
sdk/src/main/java/com/alibaba/higress/sdk/
├── config/                           # 配置类
│   └── HigressServiceConfig.java     # Higress服务配置
├── constant/                         # 常量定义
│   ├── CommonKey.java                # 通用键常量
│   ├── HigressConstants.java         # Higress常量
│   ├── KubernetesConstants.java      # Kubernetes常量
│   ├── McpConstants.java            # MCP常量
│   ├── Separators.java               # 分隔符常量
│   └── plugin/                       # 插件相关常量
│       ├── BuiltInPluginName.java    # 内置插件名称
│       └── config/                   # 插件配置常量
├── exception/                         # 异常定义
│   ├── BusinessException.java        # 业务异常
│   ├── NotFoundException.java        # 未找到异常
│   ├── ResourceConflictException.java # 资源冲突异常
│   └── ValidationException.java      # 验证异常
├── http/                             # HTTP相关
│   └── HttpStatus.java               # HTTP状态码
├── model/                            # 数据模型
│   ├── ai/                           # AI相关模型
│   │   ├── AiModelPredicate.java     # AI模型谓词
│   │   ├── AiRoute.java              # AI路由
│   │   ├── AiRouteFallbackConfig.java # AI路由回退配置
│   │   ├── AiRouteFallbackStrategy.java # AI路由回退策略
│   │   ├── AiUpstream.java           # AI上游
│   │   ├── LlmProvider.java          # LLM提供商
│   │   ├── LlmProviderEndpoint.java  # LLM提供商端点
│   │   ├── LlmProviderProtocol.java  # LLM提供商协议
│   │   ├── LlmProviderType.java      # LLM提供商类型
│   │   └── TokenFailoverConfig.java  # Token故障转移配置
│   ├── authorization/                 # 认证授权
│   │   └── CredentialTypeEnum.java   # 凭证类型枚举
│   ├── consumer/                      # 消费者相关
│   │   ├── AllowList.java            # 允许列表
│   │   ├── AllowListOperation.java   # 允许列表操作
│   │   ├── Consumer.java             # 消费者
│   │   ├── Credential.java           # 凭证
│   │   ├── CredentialType.java       # 凭证类型
│   │   ├── KeyAuthCredential.java    # Key认证凭证
│   │   └── KeyAuthCredentialSource.java # Key认证凭证源
│   ├── mcp/                          # MCP相关模型
│   │   ├── ConsumerAuthInfo.java     # 消费者认证信息
│   │   ├── McpServer.java            # MCP服务器
│   │   ├── McpServerConfigMap.java   # MCP服务器配置映射
│   │   ├── McpServerConstants.java   # MCP服务器常量
│   │   ├── McpServerConsumerDetail.java # MCP服务器消费者详情
│   │   ├── McpServerConsumers.java   # MCP服务器消费者
│   │   ├── McpServerConsumersPageQuery.java # MCP服务器消费者分页查询
│   │   ├── McpServerDBTypeEnum.java  # MCP服务器数据库类型枚举
│   │   ├── McpServerPageQuery.java   # MCP服务器分页查询
│   │   ├── McpServerTypeEnum.java    # MCP服务器类型枚举
│   │   └── SwaggerContent.java       # Swagger内容
│   ├── route/                        # 路由相关
│   │   ├── CorsConfig.java           # CORS配置
│   │   ├── Header.java               # 请求头
│   │   ├── HeaderControlConfig.java # 请求头控制配置
│   │   ├── HeaderControlStageConfig.java # 请求头控制阶段配置
│   │   ├── KeyedRoutePredicate.java  # 键值路由谓词
│   │   ├── MockConfig.java           # Mock配置
│   │   ├── ProxyNextUpstreamConfig.java # 代理下一个上游配置
│   │   ├── RateLimitConfig.java      # 限流配置
│   │   ├── RedirectConfig.java       # 重定向配置
│   │   ├── RewriteConfig.java        # 重写配置
│   │   ├── RoutePredicate.java       # 路由谓词
│   │   ├── RoutePredicateTypeEnum.java # 路由谓词类型枚举
│   │   └── UpstreamService.java      # 上游服务
│   ├── wasmplugin/                   # WASM插件相关
│   │   ├── Language.java             # 语言
│   │   ├── Plugin.java               # 插件
│   │   ├── PluginCategory.java       # 插件分类
│   │   ├── PluginConfigSchema.java   # 插件配置模式
│   │   ├── PluginInfo.java           # 插件信息
│   │   ├── PluginSpec.java           # 插件规格
│   │   └── WasmPluginServiceConfig.java # WASM插件服务配置
│   ├── CommonPageQuery.java          # 通用分页查询
│   ├── Domain.java                   # 域名
│   ├── PaginatedResult.java          # 分页结果
│   ├── ProxyServer.java              # 代理服务器
│   ├── Route.java                    # 路由
│   ├── RouteAuthConfig.java          # 路由认证配置
│   ├── RoutePageQuery.java           # 路由分页查询
│   ├── Service.java                  # 服务
│   ├── ServiceSource.java            # 服务源
│   ├── ServiceSourceAuthN.java       # 服务源认证
│   ├── TlsCertificate.java           # TLS证书
│   ├── VersionedDto.java             # 版本化DTO
│   ├── WasmPlugin.java               # WASM插件
│   ├── WasmPluginConfig.java         # WASM插件配置
│   ├── WasmPluginInstance.java       # WASM插件实例
│   ├── WasmPluginInstanceScope.java  # WASM插件实例作用域
│   └── WasmPluginPageQuery.java     # WASM插件分页查询
├── service/                          # 服务层
│   ├── ai/                           # AI相关服务
│   ├── consumer/                      # 消费者服务
│   │   ├── ConsumerService.java      # 消费者服务接口
│   │   ├── ConsumerServiceImpl.java  # 消费者服务实现
│   │   ├── CredentialHandler.java    # 凭证处理器接口
│   │   └── KeyAuthCredentialHandler.java # Key认证凭证处理器
│   ├── kubernetes/                   # Kubernetes相关服务
│   │   ├── crd/                      # CRD资源定义
│   │   ├── ImageUrl.java             # 镜像URL
│   │   ├── KubernetesClientService.java # Kubernetes客户端服务
│   │   ├── KubernetesModelConverter.java # Kubernetes模型转换器
│   │   ├── KubernetesUtil.java       # Kubernetes工具
│   │   └── model/                    # Kubernetes模型
│   ├── mcp/                          # MCP相关服务
│   ├── DomainService.java            # 域名服务接口
│   ├── DomainServiceImpl.java        # 域名服务实现
│   ├── HigressServiceProvider.java   # Higress服务提供者接口
│   ├── HigressServiceProviderImpl.java # Higress服务提供者实现
│   ├── ProxyServerService.java       # 代理服务器服务接口
│   ├── ProxyServerServiceImpl.java   # 代理服务器服务实现
│   ├── RouteService.java             # 路由服务接口
│   ├── RouteServiceImpl.java         # 路由服务实现
│   ├── ServiceService.java           # 服务服务接口
│   ├── ServiceServiceByApiServerImpl.java # 通过API服务器的服务服务实现
│   ├── ServiceServiceImpl.java       # 服务服务实现
│   ├── ServiceSourceService.java     # 服务源服务接口
│   ├── ServiceSourceServiceImpl.java # 服务源服务实现
│   ├── TlsCertificateService.java    # TLS证书服务接口
│   ├── TlsCertificateServiceImpl.java # TLS证书服务实现
│   ├── WasmPluginInstanceService.java # WASM插件实例服务接口
│   ├── WasmPluginInstanceServiceImpl.java # WASM插件实例服务实现
│   ├── WasmPluginService.java        # WASM插件服务接口
│   └── WasmPluginServiceImpl.java    # WASM插件服务实现
├── util/                             # 工具类
│   ├── ConverterUtil.java            # 转换器工具
│   ├── EnvReadUtil.java              # 环境读取工具
│   ├── ListUtil.java                 # 列表工具
│   ├── MapUtil.java                  # 映射工具
│   ├── StringUtil.java               # 字符串工具
│   ├── TypeUtil.java                # 类型工具
│   └── ValidateUtil.java            # 验证工具
```

## 核心配置文件说明

### 1. pom.xml - Maven配置

- **父级配置**：Spring Boot 2.7.18
- **模块管理**：console和sdk两个子模块
- **依赖管理**：统一管理版本依赖
- **插件配置**：代码检查、格式化、文档生成

### 2. Dockerfile - 容器化配置

- **基础镜像**：openjdk:21-jdk-slim
- **端口暴露**：8080
- **启动脚本**：start.sh
- **工具集成**：MCP工具支持

### 3. 代码规范配置

- **Checkstyle**：阿里巴巴Java开发手册规范
- **PMD**：代码质量检查
- **License**：Apache 2.0许可证
- **格式化**：统一代码格式

### 4. 开发工具配置

- **Maven Wrapper**：mvnw/mvnw.cmd
- **构建脚本**：build.sh
- **启动脚本**：start.sh
- **工具脚本**：MCP相关工具

## 补充说明

### 1. 开发规范

- **包命名**：com.alibaba.higress.console / com.alibaba.higress.sdk
- **类命名**：遵循Java命名规范
- **方法命名**：动词开头，语义清晰
- **异常处理**：统一异常处理机制

### 2. 测试策略

- **单元测试**：JUnit 5 + Mockito
- **集成测试**：Spring Boot Test
- **API测试**：Swagger UI
- **性能测试**：JMeter

### 3. 部署说明

- **容器化**：Docker镜像部署
- **Kubernetes**：支持K8s部署
- **健康检查**：/healthz端点
- **监控集成**：Prometheus + Grafana

✅ **使用方法（开发者须知）**

1. 复制本模版到 AI 工具（Cursor / 通义灵码 / Claude 等）
2. 在 **Task 部分** 填写具体需求内容
3. 提交给 AI，获得代码实现与说明

---