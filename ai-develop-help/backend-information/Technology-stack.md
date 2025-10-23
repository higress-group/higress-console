# 技术栈

## 开发者须知（AI无需阅读）

1. 本文为后端项目技术栈文件

## 📋 目录索引

- [核心框架](#核心框架)
- [依赖管理](#依赖管理)
- [开发工具](#开发工具)
- [部署技术](#部署技术)
- [版本要求](#版本要求)

## 核心框架

### 1. Spring Boot 生态

- **Spring Boot 2.7.18** - 主框架，提供自动配置和快速开发能力
- **Spring Web** - Web应用开发支持
- **Spring AOP** - 面向切面编程支持
- **Spring Validation** - 数据验证框架
- **Spring Boot Starter Test** - 测试支持

### 2. Kubernetes 集成

- **Kubernetes Client Java 17.0.0** - 官方Kubernetes Java客户端
- **CRD支持** - 自定义资源定义管理
- **ConfigMap/Secret** - 配置和密钥管理
- **Service/Ingress** - 服务发现和负载均衡

### 3. HTTP 客户端

- **Retrofit 2.9.0** - 类型安全的HTTP客户端
- **Jackson Converter** - JSON序列化/反序列化
- **Apache HttpClient** - HTTP连接池管理

## 依赖管理

### 1. 核心依赖

- **Google Guava 31.1-jre** - Google核心库，提供集合、缓存、并发等工具
- **Apache Commons Lang3 3.13.0** - Apache通用工具库
- **Apache Commons Collections4 4.4** - 集合工具库
- **Alibaba Fastjson 1.2.83** - 高性能JSON处理库
- **BouncyCastle 1.46** - 加密算法库

### 2. 开发工具依赖

- **Lombok** - 代码生成工具，减少样板代码
- **Project Lombok Maven Plugin 1.18.20.0** - Lombok Maven插件
- **Swagger Core 2.2.20** - API文档生成
- **SpringDoc OpenAPI UI 1.8.0** - OpenAPI 3.0支持

### 3. 测试依赖

- **JUnit Jupiter** - 单元测试框架
- **Mockito Core** - Mock测试框架
- **Mockito JUnit Jupiter** - Mockito与JUnit集成
- **Apache Velocity 2.3** - 模板引擎（用于代码生成）

## 开发工具

### 1. 构建工具

- **Maven 3.6+** - 项目构建和依赖管理
- **Maven Wrapper** - 项目自包含Maven环境
- **Maven Compiler Plugin** - Java编译插件
- **Maven Source Plugin** - 源码打包插件
- **Maven Javadoc Plugin** - 文档生成插件

### 2. 代码质量工具

- **Maven PMD Plugin 3.20.0** - 代码质量检查
- **Maven Checkstyle Plugin 3.2.1** - 代码规范检查
- **P3C PMD 2.1.1** - 阿里巴巴Java开发手册检查
- **License Maven Plugin 4.1** - 许可证管理

### 3. 前端集成

- **Frontend Maven Plugin 1.12.1** - 前端构建集成
- **Node.js 16.19.0** - 前端构建环境
- **NPM** - 前端依赖管理

### 4. 版本控制

- **Git Commit ID Plugin 6.0.0** - Git信息注入
- **Maven GPG Plugin 3.1.0** - 签名管理
- **Central Publishing Plugin 0.3.0** - 中央仓库发布

## 部署技术

### 1. 容器化技术

- **Docker** - 容器化部署
- **OpenJDK 21** - 运行时环境
- **Alpine Linux** - 轻量级基础镜像
- **多架构支持** - AMD64/ARM64架构

### 2. 容器配置

- **基础镜像**：openjdk:21-jdk-slim
- **工作目录**：/app
- **端口暴露**：8080
- **启动脚本**：start.sh
- **工具集成**：MCP工具支持

### 3. 运行时环境

- **JVM参数**：支持自定义JVM_ARGS
- **环境变量**：KUBECONFIG等配置
- **健康检查**：/healthz端点
- **优雅关闭**：支持SIGTERM信号

### 4. 监控和日志

- **Spring Actuator** - 应用监控端点
- **Micrometer** - 指标收集
- **Prometheus** - 指标存储
- **Grafana** - 可视化监控

## 版本要求

### 1. 开发环境

- **JDK版本**：Java 8+（推荐Java 11+）
- **Maven版本**：3.6+
- **Docker版本**：20.10+
- **Kubernetes版本**：1.20+

### 2. 运行时环境

- **JDK版本**：Java 8+（推荐Java 11+）
- **内存要求**：最小1GB，推荐2GB+
- **CPU要求**：最小1核，推荐2核+
- **存储要求**：最小1GB可用空间

### 3. 依赖版本兼容性

- **Spring Boot 2.7.18** - 长期支持版本
- **Kubernetes Client 17.0.0** - 支持K8s 1.20+
- **Retrofit 2.9.0** - 稳定版本
- **Guava 31.1-jre** - 最新稳定版

## 技术栈特点

### 1. 企业级特性

- **高可用性**：支持集群部署和故障转移
- **可扩展性**：微服务架构，支持水平扩展
- **安全性**：完整的认证授权体系
- **监控性**：全面的监控和告警支持

### 2. 云原生支持

- **Kubernetes原生**：深度集成K8s生态
- **容器化部署**：Docker镜像部署
- **服务发现**：自动服务注册发现
- **配置管理**：ConfigMap/Secret集成

### 3. 开发体验

- **快速开发**：Spring Boot自动配置
- **类型安全**：强类型Java开发
- **代码质量**：完整的代码检查工具链
- **文档生成**：自动API文档生成

### 4. 运维友好

- **健康检查**：应用状态监控
- **指标收集**：性能指标监控
- **日志管理**：结构化日志输出
- **配置热更新**：支持配置动态更新

## 补充说明

### 1. 开发规范

- **代码风格**：遵循阿里巴巴Java开发手册
- **API设计**：RESTful API设计原则
- **异常处理**：统一异常处理机制
- **日志规范**：结构化日志输出

### 2. 测试策略

- **单元测试**：JUnit 5 + Mockito
- **集成测试**：Spring Boot Test
- **API测试**：Swagger UI测试
- **性能测试**：JMeter压力测试

### 3. 部署策略

- **容器化部署**：Docker镜像部署
- **Kubernetes部署**：支持K8s集群部署
- **滚动更新**：支持零停机更新
- **回滚机制**：支持快速回滚

✅ **使用方法（开发者须知）**

1. 复制本模版到 AI 工具（Cursor / 通义灵码 / Claude 等）
2. 在 **Task 部分** 填写具体需求内容
3. 提交给 AI，获得代码实现与说明

---