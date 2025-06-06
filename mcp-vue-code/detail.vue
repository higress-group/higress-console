<template>
  <com-page-detail-column>
    <template #header>
      <com-page-back-title @back="onBack">
        {{ $route.params.mcpId }}
        <template #action>
          <div>
            <el-button type="primary" size="small" @click="openEdit">
              编辑
            </el-button>
            <el-button
              v-if="activeTab === 'tools'"
              type="primary"
              size="small"
              @click="openEditTool"
              :disabled="drawerFormData.type !== SERVICE_TYPE.OPENAPI"
            >
              编辑工具
            </el-button>
            <el-button size="small" @click="onOffline">删除</el-button>
          </div>
        </template>
      </com-page-back-title>
      <el-tabs class="com-page-detail-tabs" v-model="activeTab">
        <el-tab-pane label="基本信息" name="config"></el-tab-pane>
        <el-tab-pane label="工具" name="tools"></el-tab-pane>
        <el-tab-pane label="资源" name="resource" disabled></el-tab-pane>
        <el-tab-pane label="Prompt" name="prompt" disabled></el-tab-pane>
        <el-tab-pane label="消费者认证" name="auth"></el-tab-pane>
      </el-tabs>
    </template>
    <template #main>
      <template v-if="activeTab === 'config'">
        <com-card title="基本信息" header-border border>
          <el-descriptions :column="2" class="column-2 description-wrapper">
            <el-descriptions-item label="名称">
              {{ drawerFormData.name }}
            </el-descriptions-item>
            <el-descriptions-item label="描述">
              {{ drawerFormData.description || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="关联域名">
              <a
                v-for="domain in drawerFormData.domains"
                :key="domain"
                @click="jumpToDomainDetail(domain)"
              >
                {{ domain }}
              </a>
            </el-descriptions-item>
            <el-descriptions-item label="服务类型">
              {{ SERVICE_TYPE_MAP[drawerFormData.type] || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="后端服务">
              <a
                v-for="service in drawerFormData.services"
                :key="service.name"
                @click="jumpToServiceDetail(service)"
              >
                {{ service.name }}
              </a>
            </el-descriptions-item>
          </el-descriptions>
        </com-card>
        <com-card title="接入点信息" header-border border>
          <el-descriptions :column="2" class="column-2 description-wrapper">
            <el-descriptions-item label="SSE接入点">
              {{ `${apiGatewayUrl}/mcp-servers/${$route.params.mcpId}/sse` }}
              <com-copy
                :content="`${apiGatewayUrl}/mcp-servers/${$route.params.mcpId}/sse`"
              ></com-copy>
            </el-descriptions-item>
            <el-descriptions-item label="Streamable HTTP接入点">
              {{ `${apiGatewayUrl}/mcp-servers/${$route.params.mcpId}` }}
              <com-copy
                :content="`${apiGatewayUrl}/mcp-servers/${$route.params.mcpId}`"
              ></com-copy>
            </el-descriptions-item>
          </el-descriptions>
        </com-card>
      </template>
      <template v-if="activeTab === 'tools'">
        <com-card header-border>
          <template #title>
            <span class="tools-title">Tools({{ tools.length }})</span>
          </template>
          <template v-if="tools.length === 0">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
              "
            >
              <!-- <img
                src="@/assets/images/empty.png"
                style="width: 120px; margin-bottom: 16px"
              /> -->
              <div style="color: #888; margin-bottom: 16px">
                当前暂无工具，请添加
              </div>
              <el-button type="primary" @click="openEditTool">
                + 添加工具
              </el-button>
            </div>
          </template>
          <template v-else>
            <el-table :data="tools" style="width: 100%; margin-bottom: 16px">
              <el-table-column prop="name" label="工具名称" min-width="120" />
              <el-table-column
                prop="description"
                label="描述"
                min-width="180"
              />
              <el-table-column label="参数" min-width="200">
                <template #default="scope">
                  <div v-if="scope.row.args && scope.row.args.length">
                    <div v-for="arg in scope.row.args" :key="arg.name">
                      <b>{{ arg.name }}</b>
                      : {{ arg.description }}
                    </div>
                  </div>
                  <span v-else>无</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </com-card>

        <com-card title="连接 MCP 服务" header-border>
          <div class="step-block">
            <div class="step-title">Step 1. 生成 URL</div>
            <a style="font-size: 14px; margin-right: 5px">
              {{ apiGatewayUrl }}
            </a>
            <com-copy :content="apiGatewayUrl"></com-copy>
            <el-tabs v-model="httpTab" class="http-tabs">
              <el-tab-pane label="Streamable HTTP" name="http">
                <com-monaco-editor
                  v-model="httpJson"
                  style="height: 200px"
                  :show-copy="true"
                  :opts="{
                    readOnly: true,
                    scrollbar: {
                      vertical: 'hidden',
                      horizontal: 'hidden',
                      handleMouseWheel: false,
                      alwaysConsumeMouseWheel: false,
                    },
                    overviewRulerLanes: 0,
                  }"
                ></com-monaco-editor>
              </el-tab-pane>
              <el-tab-pane label="SSE" name="sse">
                <com-monaco-editor
                  v-model="sseJson"
                  style="height: 200px"
                  :show-copy="true"
                  :opts="{
                    readOnly: true,
                    scrollbar: {
                      vertical: 'hidden',
                      horizontal: 'hidden',
                      handleMouseWheel: false,
                      alwaysConsumeMouseWheel: false,
                    },
                    overviewRulerLanes: 0,
                  }"
                ></com-monaco-editor>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="step-block">
            <div class="step-title">Step 2. 域名 DNS 映射</div>
            <div class="dns-box">
              <div class="dns-desc">
                需要将业务域名在 DNS 服务中 CNAME 至网关访问入口地址
              </div>
              <div class="dns-content">
                <div>网关访问地址：</div>
                <div style="margin-top: 4px">
                  公网：
                  <a style="font-size: 14px; margin-right: 5px">
                    {{ apiGatewayUrl }}
                  </a>
                  <com-copy :content="apiGatewayUrl"></com-copy>
                </div>
              </div>
            </div>
          </div>
        </com-card>

        <edit-tool-drawer
          v-model="editToolVisible"
          v-model:raw-configurations="drawerFormData.rawConfigurations"
          :service-type="drawerFormData.type"
          @submit="handleEditToolSubmit"
        />
      </template>
      <template v-if="activeTab === 'resource'">
        <mcp-meta-panel
          type="resource"
          :metaList="resources"
          @add="onAddResource"
        />
      </template>
      <template v-if="activeTab === 'prompt'">
        <mcp-meta-panel type="prompt" :metaList="prompts" @add="onAddPrompt" />
      </template>
      <template v-if="activeTab === 'auth'">
        <com-card title="消费者认证" header-border>
          <template #title>
            <span class="config-title">配置信息</span>
            <!-- <el-button type="text" class="config-edit" @click="onEditConfig">
              编辑
              <i class="el-icon-edit"></i>
            </el-button> -->
          </template>
          <div style="display: flex; align-items: center; gap: 12px">
            <span>MCP消费者认证-启用状态：</span>
            <el-switch v-model="authEnabled" @change="handleAuthChange" />
            <template v-if="authEnabled">
              <span>认证方式</span>
              <span>
                API Key
                <el-tooltip placement="top">
                  <template #content>
                    <div
                      style="
                        white-space: normal;
                        word-break: break-all;
                        width: 300px;
                      "
                    >
                      API
                      Key是一种简单的认证方式，客户端访问时，需将凭证以指定的方式添加至请求中，网关收到请求后会验证API
                      Key的合法性及权限。API
                      Key常用于不涉及敏感操作的简单场景，安全性相比JWT、AK/SK较低，请注意凭证的管理与保护。
                    </div>
                  </template>
                  <i
                    class="el-icon-question"
                    style="color: #999; vertical-align: middle; font-size: 14px"
                  ></i>
                  <!-- <el-icon :size="16" style="color: #999; vertical-align: middle">
              <QuestionFilled />
            </el-icon> -->
                </el-tooltip>
              </span>
            </template>
          </div>
        </com-card>

        <com-card title="消费者" header-border>
          <ConsumerTable></ConsumerTable>
        </com-card>
        <el-dialog
          v-model="configDialogVisible"
          title="MCP服务消费者认证"
          width="480px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div style="display: flex; align-items: center; margin-bottom: 32px">
            <span
              style="
                font-size: 16px;
                margin-right: 24px;
                width: 90px;
                text-align: right;
              "
            >
              启用状态
            </span>
            <el-switch v-model="configEnabled"></el-switch>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 32px">
            <span
              style="
                font-size: 16px;
                margin-right: 24px;
                width: 90px;
                text-align: right;
              "
            >
              认证方式
            </span>
            <el-radio-group v-model="authType">
              <el-radio label="apiKey">API Key</el-radio>
            </el-radio-group>
            <el-tooltip content="目前仅支持 API Key 认证" placement="top">
              <i
                class="el-icon-question"
                style="margin-left: 8px; color: #888"
              ></i>
            </el-tooltip>
          </div>
          <template #footer>
            <el-button @click="handleConfigDialogCancel">取消</el-button>
            <el-button type="primary" @click="handleConfigDialogConfirm">
              确认
            </el-button>
          </template>
        </el-dialog>
      </template>
      <mcp-form-drawer
        v-model="drawerVisible"
        :is-edit="true"
        :form-data="drawerFormData"
        @submit="handleDrawerSubmit"
      />
    </template>
  </com-page-detail-column>
</template>
<script>
  import McpFormDrawer from './components/McpFormDrawer.vue'
  import ComPageDetailColumn from '@/components/com-page-detail-column'
  import EditToolDrawer from './components/EditToolDrawer.vue'
  import McpMetaPanel from './components/McpMetaPanel.vue'
  import YamlUtil from './components/yamlUtil'
  import { getMcpServer, updateMcpServer } from '../../api/mcp'
  import {
    SERVICE_TYPE,
    SERVICE_TYPE_MAP,
    DOMAIN_PROTOCOL_MAP,
  } from './components/constant'
  import { getDomain } from '@/api/domain'
  import ConsumerTable from './components/ConsumerTable.vue'
  export default {
    components: {
      ComPageDetailColumn,
      McpFormDrawer,
      EditToolDrawer,
      McpMetaPanel,
      ConsumerTable,
    },
    data() {
      return {
        sseJson: '',
        httpJson: '',
        SERVICE_TYPE,
        SERVICE_TYPE_MAP,
        activeTab:
          localStorage.getItem(
            `mcpDetailActiveTab-${this.$route.params.mcpId}`
          ) || 'tools',
        httpTab: 'sse',
        drawerVisible: false,
        authEnabled: false,
        apiGatewayUrl: '',
        drawerFormData: {},
        editToolVisible: false,
        consumerSearch: '',
        configEnabled: false,
        configDialogVisible: false,
        authType: 'apiKey',
        tools: [],
        resources: [
          {
            uri: 'file:///logs/app.log',
            name: 'Application Logs',
            mimeType: 'text/plain',
          },
        ],
        prompts: [
          {
            name: 'git-commit',
            description: 'Generate a Git commit message',
            arguments: [
              {
                name: 'changes',
                description: 'Git diff or description of changes',
                required: true,
              },
            ],
          },
          {
            name: 'explain-code',
            description: 'Explain how code works',
            arguments: [
              {
                name: 'code',
                description: 'Code to explain',
                required: true,
              },
              {
                name: 'language',
                description: 'Programming language',
                required: false,
              },
            ],
          },
        ],
        selectedConsumer: null,
      }
    },
    watch: {
      activeTab(newVal) {
        localStorage.setItem(
          `mcpDetailActiveTab-${this.$route.params.mcpId}`,
          newVal
        )
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      jumpToServiceDetail({ name }) {
        this.$router.push({
          path: `/service/${name}`,
        })
      },
      jumpToDomainDetail(domain) {
        this.$router.push({
          path: `/domain/${domain}`,
        })
      },
      async init() {
        try {
          const res = await getMcpServer({
            mcpServerName: this.$route.params.mcpId,
          })
          if (res.code === 200 && res.data) {
            this.drawerFormData = res.data
            if (res.data.rawConfigurations) {
              this.tools =
                YamlUtil.parseYaml(res.data.rawConfigurations).tools || []
            } else {
              this.tools = []
            }
            this.authEnabled = res.data.consumerAuthInfo?.enable || false
            const { data: domainDetailInfo } = await getDomain(
              res.data.domains[0]
            )
            const domainProtocol =
              DOMAIN_PROTOCOL_MAP[domainDetailInfo.protocol]
            this.apiGatewayUrl = domainProtocol + '://' + res.data.domains[0]
            this.sseJson = this.generateJson('sse')
            this.httpJson = this.generateJson('http')
          }
        } catch (error) {
          console.error('Failed to get MCP server info:', error)
          this.$message.error('获取MCP服务信息失败')
        }
      },
      generateJson(type) {
        if (type === 'http') {
          return `{
  "mcpServers": {
    "${this.$route.params.mcpId}": {
      "url": "${this.apiGatewayUrl}/mcp-servers/${this.$route.params.mcpId}"
    }
  }
}`
        }
        if (type === 'sse') {
          return `{
  "mcpServers": {
      "${this.$route.params.mcpId}": {
        "url": "${this.apiGatewayUrl}/mcp-servers/${this.$route.params.mcpId}/sse"
    }
  }
}`
        }
        return '{}'
      },
      async handleAuthChange() {
        try {
          const mcpInfo = await getMcpServer({
            mcpServerName: this.$route.params.mcpId,
          })
          if (mcpInfo.code !== 200) {
            throw new Error('获取MCP服务信息失败')
          }
          const res = await updateMcpServer({
            ...mcpInfo.data,
            mcpServerName: this.$route.params.mcpId,
            consumerAuthInfo: {
              enable: this.authEnabled,
              type: 'API_KEY',
              strategyConfigId: mcpInfo.data.consumerAuthInfo?.strategyConfigId,
            },
          })
          if (res.code === 200) {
            this.$message.success(
              '当前状态：' + (this.authEnabled ? '已启用' : '未启用')
            )
            this.init()
          } else {
            throw new Error('更新MCP服务信息失败')
          }
        } catch (error) {
          this.$message.error('更新MCP消费者认证状态失败')
          this.authEnabled = !this.authEnabled
        }
      },
      async handleDrawerSubmit(data) {
        const res = await updateMcpServer(data)
        if (res.code === 200) {
          this.$message.success('更新成功')
          this.drawerVisible = false
          this.init()
        }
      },
      openEdit() {
        this.drawerVisible = true
      },
      onOffline() {
        this.$confirm('确认删除该MCP服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$message.success('删除成功')
        })
      },
      openEditTool() {
        this.editToolVisible = true
      },
      async handleEditToolSubmit(rawConfigurations, securitySchemes) {
        const res = await getMcpServer({
          mcpServerName: this.$route.params.mcpId,
          gwInstanceId: this.$route.params.gwInstanceId,
        })
        if (res.code === 200) {
          const updateRes = await updateMcpServer({
            ...res.data,
            mcpServerName: this.$route.params.mcpId,
            rawConfigurations: rawConfigurations,
            securitySchemes: securitySchemes,
          })
          if (updateRes.code === 200) {
            this.$message.success('更新成功')
            this.init()
          }
        }
        this.editToolVisible = false
      },
      onEditConfig() {
        this.configDialogVisible = true
      },
      handleConfigDialogConfirm() {
        this.$message.success(
          '当前状态：' + (this.configEnabled ? '已启用' : '未启用')
        )
        this.configDialogVisible = false
      },
      handleConfigDialogCancel() {
        this.configDialogVisible = false
      },
      onSearchConsumer() {
        this.$message.info('搜索消费者：' + this.consumerSearch)
      },
      onBack() {
        this.$router.push({
          path: '/mcp',
        })
      },
      onAddResource() {
        this.$message.info('新增资源')
      },
      onAddPrompt() {
        this.$message.info('新增Prompt')
      },
      getDomainDetailUrl(domain) {
        return `/domain/${domain}?gwInstanceId=${this.drawerFormData.gwInstanceId}&engineType=higress`
      },
      getServiceDetailUrl(serviceName) {
        return `/service/${serviceName}?gwInstanceId=${this.drawerFormData.gwInstanceId}&engineType=higress`
      },
    },
  }
</script>

<style scoped>
  .mcp-detail-container {
    background: #fff;
    padding: 0 24px;
    display: flex;
  }
  .back-btn {
    font-size: 20px;
    cursor: pointer;
    margin-right: 16px;
  }
  .title {
    font-size: 22px;
    font-weight: bold;
    margin-right: 12px;
  }
  .status.success {
    color: #52c41a;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    padding: 2px 8px;
    margin-right: 16px;
    font-size: 14px;
  }
  .actions {
    margin-left: auto;
  }
  .main-content {
    display: flex;
    margin-top: 24px;
  }
  .left-panel {
    /* width: 340px; */
    flex: 1;
    border-right: 1px solid #f0f0f0;
    padding-right: 32px;
  }
  .tools-title {
    font-weight: bold;
    margin-bottom: 12px;
    font-size: 16px;
  }
  .edit-tools-btn {
    margin-top: 16px;
  }
  .right-panel {
    /* flex: 1; */
    width: 400px;
    padding-left: 32px;
  }
  .connect-title {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 12px;
  }
  .agent-btn {
    margin-bottom: 16px;
  }
  .step-block {
    margin-bottom: 24px;
  }
  .step-title {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 16px;
  }
  .domain-input {
    width: 100%;
    margin-bottom: 8px;
  }
  .http-tabs {
    margin-bottom: 8px;
  }
  .copy-btn {
    margin-top: 8px;
  }
  .dns-box {
    background: #f7f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 2px;
    padding: 16px 20px 12px 20px;
    margin-top: 8px;
  }
  .dns-desc {
    background: #f0f2f5;
    padding: 8px 12px;
    border-radius: 2px 2px 0 0;
    color: #666;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .dns-content {
    font-size: 14px;
    color: #222;
  }
  .gateway-link {
    color: #409eff;
    text-decoration: underline;
    margin-left: 4px;
  }
  .tool-detail-block {
    background: #fff;
    padding: 24px 32px 24px 32px;
    border-radius: 12px;
    margin: 12px 0 0 0;
  }
  .tool-detail-title {
    font-size: 22px;
    font-weight: 500;
    color: #666;
    margin-bottom: 18px;
  }
  .tool-param-block {
    margin-bottom: 18px;
  }
  .tool-param-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .tool-param-code {
    background: #222;
    color: #fff;
    border-radius: 6px;
    padding: 18px 24px;
    font-size: 16px;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    white-space: pre-line;
    margin: 0;
  }
  .config-info-block {
    padding: 12px 0 8px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
  }
  .config-title {
    margin-right: 12px;
  }
  .config-edit {
    margin-right: 18px;
    font-size: 12px;
  }
  .config-status {
    display: flex;
    align-items: center;
  }
  .status-dot {
    margin-right: 4px;
  }
  ::v-deep(.mcp-auth-config-modal .el-message-box__content) {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
  }
  ::v-deep(.mcp-auth-config-modal .el-message-box__btns) {
    justify-content: center;
  }
</style>
