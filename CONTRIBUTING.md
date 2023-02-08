# 为 Higress Console 做贡献

如果你有兴趣为 Higress Console 做出贡献，我们会热烈欢迎。首先，我们非常鼓励这种意愿。这是为您提供的贡献指南列表。

[[English Contributing Document](./CONTRIBUTING_EN.md)]

## 话题

- [为 Higress Console 做贡献](#为-higress-console-做贡献)
  - [话题](#话题)
  - [报告一般问题](#报告一般问题)
  - [代码和文档贡献](#代码和文档贡献)
    - [工作区准备](#工作区准备)
    - [分支定义](#分支定义)
    - [提交规则](#提交规则)
      - [提交消息](#提交消息)
      - [提交内容](#提交内容)
    - [PR 说明](#pr-说明)
  - [测试用例贡献](#测试用例贡献)
  - [参与帮助任何事情](#参与帮助任何事情)
  - [代码风格](#代码风格)
    - [前端部分](#前端部分)
    - [后端部分](#后端部分)
  - [项目结构](#项目结构)
    - [前端部分](#前端部分-1)
    - [后端部分](#后端部分-1)

## 报告一般问题

老实说，我们把每一个 Higress Console 用户都视为非常善良的贡献者。在体验了 Higress 之后，您可能会对项目有一些反馈。然后随时通过 [NEW ISSUE](https://github.com/higress-group/higress-console/issues/new/choose)打开一个问题。

因为 Higress Console 是一个分布式合作的项目，所以我们非常新昌详细的、准确的问题报告。为了提升沟通效率，我们希望每个人在提出问题前先在列表中进行搜索。如果相应的问题已经存在，请在现有问题下的评论中添加您的详细信息，而不是创建一个新的问题。

为了使问题细节尽可能标准，我们为问题报告者设置了一个[问题模板](./.github/ISSUE_TEMPLATE)。请务必按照说明填写模板中的字段。

有很多情况你可以打开一个问题：

* 错误报告
* 功能要求
* 性能问题
* 功能提案
* 功能设计
* 需要帮助
* 文档不完整
* 测试改进
* 关于项目的任何问题
* 等等

另外我们必须提醒的是，在填写新问题时，请务必从您的帖子中删除敏感数据，如密码、密钥、网络位置、私人业务数据等。

## 代码和文档贡献

我们鼓励采取一切措施来让 Higress Console 项目变得更好。在 GitHub 上，Higress Console 的每项改进都可以通过 PR（Pull Request 的缩写）实现。

* 如果您发现错别字，请尝试修复它！
* 如果您发现错误，请尝试修复它！
* 如果您发现一些多余的代码，请尝试删除它们！
* 如果您发现缺少一些测试用例，请尝试添加它们！
* 如果您可以增强功能，请**不要**犹豫！
* 如果您发现代码晦涩难懂，请尝试添加注释以使其更加易读！
* 如果您发现代码丑陋，请尝试重构它！
* 如果您能帮助改进文档，那就再好不过了！
* 如果您发现文档不正确，只需执行并修复它！
* ...

我们显然无法完全列出这一列表中的所有项目。但请记住一个原则：

> 我们期待您的任何 PR。

由于您已准备好通过 PR 来改进 Higress Console，我们建议您可以在此处查看 PR 规则。

* [工作区准备](#工作区准备)
* [分支定义](#分支定义)
* [提交规则](#提交规则)
* [PR 说明](#PR%20说明)
* [项目结构](#项目结构)

### 工作区准备

为了提出 PR，我们假设你已经注册了一个 GitHub ID。然后您可以通过以下步骤完成准备工作：

1. **FORK** Higress 到您的代码仓库。要完成这项工作，您只需单击 [higress-group/higress-console](https://github.com/higress-group/higress-console) 主页右侧的 Fork 按钮。然后你将在 
   中得到你的存储库`https://github.com/<your-username>/higress-console`，其中`your-username`是你的 GitHub 用户名。

2. **克隆** 您自己的代码仓库到本地并进行开发。使用 `git clone git@github.com:<your-username>/higress=console.git` 命令将代码仓库克隆到本地计算机。 然后您可以创建新分支来完成您希望进行的更改。

3. **设置远程** 使用以下两个命令将仓库上游设置为 `git@github.com:higress-group/higress-console.git`：

```bash
git remote add upstream git@github.com:higress-group/higress-console.git
git remote set-url --push upstream no-pushing
```

你可以使用以下命令检查本地仓库的当前上游设置：

```shell
$ git remote -v
origin     git@github.com:\<your-username\>/higress-console.git (fetch)
origin     git@github.com:\<your-username\>/higress-console.git (push)
upstream   git@github.com:higress-group/higress-console.git (fetch)
upstream   no-pushing (push)
```

添加这个，我们可以轻松地将本地分支与上游分支同步。

### 分支定义

现在我们假设通过拉取请求进行的每个贡献都是针对 Higress Console 中的 [主分支](https://github.com/higress-group/higress-console/tree/main) 。在贡献之前，请注意分支定义会很有帮助。

作为贡献者，请再次记住，通过拉取请求的每个贡献都是针对主分支的。而在 Higress Console 项目中，还有其他几种分支，我们一般称它们为 release 分支（如0.6.0、0.6.1）、feature 分支、hotfix 分支。

当正式发布一个版本时，我们将会创建一个发布分支并以版本号命名。

在发布之后，我们会将发布分支的提交合并到主分支中。

当我们发现某个版本有 bug 时，我们会决定在以后的版本中修复它，或者在特定的 hotfix 版本中修复它。当我们决定在 hotfix 版本中修复时，我们会根据对应的 release 分支 checkout 出 hotfix 分支，进行代码修复和验证，然后合并到主分支。

对于较大的功能，我们将拉出功能分支进行开发和验证。

### 提交规则

实际上，在 Higress Console 中，我们在提交时会认真对待两条规则：

* [提交消息](#提交消息)
* [提交内容](#提交内容)

#### 提交消息

提交消息可以帮助审稿人更好地理解提交 PR 的目的是什么。它还可以帮助加快代码审查过程。我们鼓励贡献者使用显式的提交信息，而不是模糊的信息。一般来说，我们提倡使用以下的提交消息类型：

* docs: xxxx. For example, "docs: add docs about Higress cluster installation".
* feature: xxxx.For example, "feature: use higress config instead of istio config".
* bugfix: xxxx. For example, "bugfix: fix panic when input nil parameter".
* refactor: xxxx. For example, "refactor: simplify to make codes more readable".
* test: xxx. For example, "test: add unit test case for func InsertIntoArray".
* 其他可读和显式的表达方式。

另一方面，我们不鼓励贡献者通过以下方式提交消息：

* ~~修复错误~~
* ~~更新~~
* ~~添加文档~~

如果你不知道该怎么做，请参阅 [如何编写 Git 提交消息](http://chris.beams.io/posts/git-commit/) 作为开始。

#### 提交内容

提交内容表示一次提交中包含的所有内容更改。我们最好在一次提交中包含可以支持审阅者完整审查的内容，而无需任何其他提交的帮助。换句话说，一次提交中的内容可以通过 CI 以避免代码混乱。简而言之，我们需要牢记三个小规则：

* 避免在提交中进行非常大的更改；
* 每次提交都完整且可审查。
* 提交时检查 git config(`user.name`, `user.email`) 以确保它与您的 GitHub ID 相关联。

```bash
git config --get user.name
git config --get user.email
```

另外，在代码变更部分，我们建议所有贡献者阅读 Higress Console 的 [代码风格](#代码风格)。

无论是提交信息，还是提交内容，我们都非常的重视代码审查过程。

### PR 说明

PR 是更改 Higress Console 项目文件的唯一方法。为了帮助审查人更好地理解你的目的，PR 描述不应过于详细。我们鼓励贡献者遵循 [PR 模板](./.github/PULL_REQUEST_TEMPLATE.md) 来完成拉取请求。

## 测试用例贡献

任何测试用例都会受到欢迎。目前，Higress Console 功能测试用例是高优先级的。

//TBD

## 参与帮助任何事情

我们选择 GitHub 作为 Higress Console 协作的主要场所。所以 Higress Console 的最新更新总是在这里。尽管通过 PR 贡献是一种明确的帮助方式，但我们仍然呼吁其他方式为项目做出贡献：

* 如果可以的话，回复别人的问题；
* 帮助解决其他用户的问题；
* 帮助审查他人的 PR 设计；
* 帮助审查其他人在 PR 中的代码；
* 讨论 Higress Console 以使事情更清楚；
* 在 Github 之外宣传 Higress 技术；
* 写关于 Higress 的博客等等。

## 代码风格

### 前端部分

// TBD

### 后端部分

后端项目以阿里巴巴发布的《[Java 开发规范](https://github.com/alibaba/p3c/)》作为其编码规范。大家可以点击链接下载最新的 PDF 文档。

为了统一代码的格式风格，我们提供了供 Eclipse Code Formatter （IDEA 用户可以安装 [Adapter for Eclipse Code Formatter](https://plugins.jetbrains.com/plugin/6546-adapter-for-eclipse-code-formatter) 插件）的配置文件，路径为`./backend/style/higress_formatter.xml`，以便大家在开发过程中对代码进行一键格式化。同时为了确保规范的实施效果，后端项目的 pom 中集成了 P3C-PMD 和 CheckStyle 插件，在执行 Maven 编译时会对编码规范进行检查。如果检查过程中发现了高优先级的问题，插件则会报错，中断编译过程。

同时，每一个源码文件均需要在头部添加 Higress 的开源协议信息。为了便于大家快速添加开源协议文本，项目的 pom 中已经通过 Profile 集成了自动的协议填充插件。大家可以使用 `./mvnw generate-sources -P license` 命令快速在代码文件中填充上协议文本。

## 项目结构

Higress Console 采用了前后端分离的架构设计，所以项目由前端和后端两部分组成，

### 前端部分

前端部分（frontend）基于 React 的应用研发框架[飞冰 (ICE)](https://v3.ice.work/)搭建。

前端部分的目录结构如下：

- build：构建产物输出目录
- public：保存一些公共资源，如多语言资源文件等
- src
  - components：页面上会用到的一些公共组件
  - interfaces：前后端交互中会使用到的数据模型
  - pages：各个前端页面
  - services：封装实际负责与后端进行交互的 API 调用

### 后端部分

后端部分（backend）基于 [Spring Boot 2](https://spring.io/projects/spring-boot) 搭建。其本身并不直接关联存储系统。所有的数据均保存在 K8s 等外部系统中。在读写数据时，它需要让数据在业务模型和外部系统能够理解和存储的模型之间进行转换。

后端部分的目录结构如下：

- src/main/java
  - constant：与项目有关的常量，如配置项键名值、K8s Label 和 Annotation 键值等
  - controller：Restful Controller，负责处理 API 请求
    - dto：各类面向业务的数据模型
  - service：负责处理业务模型的服务接口与实现
    - kubernetes：负责对接 K8s 的服务实现
- style：与代码风格有关的数据和配置文件

后端的架构整体分为三层，由上至下分别为：

1. Controller：负责处理 API 调用。输入输出均为业务数据模型。唯一与 Restful、HTTP API Request 和 Response 打交道的一层；
2. Service：负责连接 Controller 与 Engine 两层。从 Controller 层接受业务模型，转换成 Engine 层能够理解和操作的数据模型，调用 Engine 层来完成实际的业务操作；
3. Engine：负责与外部系统进行对接，实际进行数据的读写操作。

以路由管理模块为例：
1. `RouteController` 负责接受外部请求，并调用 `RouteService` 接口完成相关操作并把结果返回给调用方；
2. `RouteService`的实现会使用`KubernetesModelConverter`将调用方传来的业务模型转换为 K8s CRD 数据，并调用 `KubernetesClientService`完成最终的读写操作；
3. `KubernetesClientService` 通过 Kubernetes Client SDK 调用 K8s API，完成实际的数据读写操作。 