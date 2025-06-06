<template>
  <el-drawer
    :title="isEdit ? '编辑 MCP 服务' : '创建 MCP 服务'"
    size="800px"
    @open="onOpen"
    @close="handleClose"
    destroy-on-close
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <el-form-item label="名称" prop="name">
        <template #label>
          名称
          <com-tip>
            名称唯一，支持英文、数字、短横线"-"，不超过64个字符，且不能以"-"开头或结尾
          </com-tip>
        </template>
        <el-input
          v-model="form.name"
          placeholder="请输入MCP服务名称"
          maxlength="64"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="255"
          placeholder="请输入描述内容"
        />
      </el-form-item>
      <el-form-item label="MCP接入点" class="mcp-endpoint-item" prop="domains">
        <div style="display: flex; align-items: center">
          <el-select
            clearable
            v-model="form.domains"
            placeholder="您可以选择多个域名"
            style="flex: 1; margin-right: 10px"
            remote
            filterable
            :loading="domainLoading"
            :remote-method="handleDomainSearch"
            reserve-keyword
          >
            <el-option
              v-for="item in domainList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button type="text" @click="getDomainList">
            <i class="el-icon-refresh" />
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="onAddDomain"
            style="width: 50px"
          >
            添加域名
          </el-button>
        </div>
        <el-input
          v-model="form.ssePath"
          placeholder="路径 (SSE) 规则为：/mcp-servers/服务名称/sse"
          style="margin-top: 8px"
          disabled
        />
        <el-input
          v-model="form.streamPath"
          placeholder="路径 (Streamable HTTP) 规则为：/mcp-servers/服务名称"
          style="margin-top: 8px"
          disabled
        />
      </el-form-item>
      <el-form-item label="服务类型" prop="type">
        <template #label>
          <span>
            服务类型
            <com-tip>McpTool服务类型</com-tip>
          </span>
        </template>
        <el-select
          style="width: 100%"
          v-model="form.type"
          placeholder="请选择服务类型"
          :disabled="isEdit"
        >
          <el-option label="OpenAPI" :value="SERVICE_TYPE.OPENAPI" />
          <el-option label="DB" :value="SERVICE_TYPE.DB" />
          <el-option label="直接路由" :value="SERVICE_TYPE.REDIRECT_ROUTE" />
        </el-select>
      </el-form-item>
      <el-form-item label="后端服务" prop="service">
        <el-select
          v-model="form.service"
          placeholder="请选择服务名称"
          style="width: 100%"
          remote
          filterable
          :loading="serviceLoading"
          :remote-method="handleServiceSearch"
          reserve-keyword
          clearable
        >
          <el-option
            v-for="item in backendServiceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="前缀匹配路径"
        prop="upstreamPathPrefix"
        v-if="form.type === SERVICE_TYPE.REDIRECT_ROUTE"
      >
        <el-input
          v-model="form.upstreamPathPrefix"
          placeholder="请输入前缀匹配path，如/api/v1"
        />
      </el-form-item>
      <el-form-item
        label="数据库配置"
        v-if="form.type === SERVICE_TYPE.DB"
        prop="dsn"
      >
        <database-config
          :dsn="form.dsn"
          :db-type="form.dbType"
          v-bind="$attrs"
          :db-url="dbUrl"
          :db-port="dbPort"
          @change="handleDsnStringChange"
        />
      </el-form-item>
      <el-form-item label="消费者认证" prop="consumerAuth">
        <el-switch v-model="form.consumerAuth" />
      </el-form-item>
      <el-form-item label="认证方式" v-if="form.consumerAuth">
        <span>
          API Key
          <com-tip placement="top">
            API
            Key是一种简单的认证方式，客户端访问时，需将凭证以指定的方式添加至请求中，网关收到请求后会验证API
            Key的合法性及权限。API
            Key常用于不涉及敏感操作的简单场景，安全性相比JWT、AK/SK较低，请注意凭证的管理与保护。
          </com-tip>
        </span>
      </el-form-item>
    </el-form>
    <div class="drawer__footer">
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存并发布</el-button>
    </div>
    <!-- <add-domain-drawer
      v-model:visible="addDomainVisible"
      @created="handleDomainCreated"
    /> -->
  </el-drawer>
</template>

<script>
  // import AddDomainDrawer from './AddDomainDrawer.vue'
  import { getListDomains } from '@/api/domain'
  import { getServiceListByPage } from '@/api/microservice'
  import { SERVICE_TYPE, DB_TYPE_OPTIONS, REG_DSN_STRING } from './constant'
  import DatabaseConfig from './DatabaseConfig.vue'

  export default {
    name: 'McpFormDrawer',
    props: {
      // modelValue: {
      //   type: Boolean,
      //   default: false,
      // },
      isEdit: {
        type: Boolean,
        default: false,
      },
      formData: {
        type: Object,
        default: () => null,
      },
    },
    emits: ['update:visible', 'submit'],
    components: { DatabaseConfig },
    data() {
      return {
        SERVICE_TYPE,
        form: {},
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            {
              pattern: /^(?!-)[A-Za-z0-9-]{1,63}[A-Za-z0-9]$/,
              message:
                '仅支持英文、数字、短横线(-)，长度2-64，且不能以"-"开头或结尾',
              trigger: 'blur',
            },
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' },
          ],
          domains: [
            {
              required: true,
              message: '请选择域名',
              validator: (rule, value, callback) => {
                if (value && value.length > 0) {
                  callback()
                } else {
                  callback(new Error('请选择域名'))
                }
              },
            },
          ],
          service: [
            { required: true, message: '请选择服务名称', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择服务类型', trigger: 'blur' },
          ],
          dbType: [
            {
              required: true,
              message: '请选择数据库类型',
              validator: (rule, value, callback) => {
                if (DB_TYPE_OPTIONS.map((item) => item.value).includes(value)) {
                  callback()
                } else {
                  callback(new Error('请选择正确的数据库类型'))
                }
              },
            },
          ],
          dsn: [
            {
              required: true,
              message: '请输入DB连接信息',
              validator: (rule, value, callback) => {
                const dsnStringValidated = value.match(REG_DSN_STRING.DEFAULT)
                if (dsnStringValidated) {
                  callback()
                } else {
                  callback(new Error('请输入正确的DB连接信息'))
                }
              },
            },
          ],
          upstreamPathPrefix: [
            {
              required: true,
              message: '请输入前缀匹配路径',
              trigger: 'blur',
            },
            {
              pattern: /^\/.*/,
              message: '路径必须以"/"开头',
              trigger: 'blur',
            },
          ],
        },
        domainList: [],
        backendServiceList: [],
        originalBackendServiceList: [],
        addDomainVisible: false,
        domainLoading: false,
        serviceLoading: false,
      }
    },
    watch: {
      'form.domains': {
        handler(newVal) {
          if (newVal && newVal.length > 0) {
            if (newVal.lastIndexOf('/') !== newVal.length - 1) {
              // this.form.ssePath = newVal + '/sse'
              // this.form.streamPath = newVal
            } else {
              // this.form.ssePath = newVal + 'sse'
              // this.form.streamPath = newVal
            }
          }
        },
      },
    },
    computed: {
      dbUrl() {
        return (
          this.originalBackendServiceList.find(
            (item) => item.name === this.form.service
          )?.nodes[0]?.ip || '-'
        )
      },
      dbPort() {
        return (
          this.originalBackendServiceList.find(
            (item) => item.name === this.form.service
          )?.nodes[0]?.port || '-'
        )
      },
    },
    methods: {
      handleClose() {
        this.$emit('update:modelValue', false)
      },
      handleDsnStringChange(dsn, dbType) {
        this.form.dsn = dsn
        this.form.dbType = dbType
      },
      initForm() {
        if (this.isEdit && this.formData) {
          this.form = {
            ...this.formData,
            service:
              this.formData.services && this.formData.services[0]
                ? this.formData.services[0].name
                : [],
            consumerAuth: this.formData.consumerAuthInfo?.enable || false,
            domains: this.formData.domains[0],
          }
        }
      },
      onOpen() {
        this.getDomainList()
        this.getBackendServiceList()
        this.initForm()
      },
      handleDsnStringValidate(valid) {
        if (valid) {
          // this.$emit('submit', this.form)
          console.log('dsnString', this.form.dsn)
        }
      },
      onSubmit() {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            const service = this.originalBackendServiceList.find(
              (item) => item.name === this.form.service
            )
            if (!service) {
              this.$message.error('请选择正确的后端服务(引用后端服务已失效)')
              return
            }
            this.$emit('submit', {
              ...this.form,
              services: [
                {
                  name: service.name,
                  port: service.nodes[0].port,
                  version: '1.0',
                  weight: service.nodes[0].weight,
                },
              ],
              ...(this.form.type === SERVICE_TYPE.DB
                ? {
                    dsn: this.form.dsn,
                    dbType: this.form.dbType,
                  }
                : {}),
              consumerAuthInfo: {
                enable: this.form.consumerAuth,
                type: 'API_KEY',
                strategyConfigId: this.form.consumerAuthInfo?.strategyConfigId,
              },
              domains: Array.isArray(this.form.domains)
                ? this.form.domains
                : [this.form.domains],
            })
          }
        })
      },
      onAddDomain() {
        this.$router.push({
          path: '/domain',
        })
      },
      handleDomainCreated(newDomain) {
        this.domainList.push(newDomain)
        this.addDomainVisible = false
      },
      handleDomainSearch(query) {
        this.domainSearchKeyword = query
        this.getDomainList(query)
      },
      handleServiceSearch(query) {
        this.serviceSearchKeyword = query
        this.getBackendServiceList(query)
      },
      getDomainList(query) {
        this.domainLoading = true
        getListDomains({
          gwInstanceId: this.$route.query.gwInstanceId,
          engineType: 'higress',
          current: 1,
          size: 20,
          ...(query ? { activeSearchName: 'domain', domain: query } : {}),
        })
          .then((res) => {
            if (res.code === 200) {
              this.domainList = res.data.records.map((item) => item.domainId)
            }
          })
          .finally(() => {
            this.domainLoading = false
          })
      },
      getBackendServiceList(query) {
        this.serviceLoading = true
        getServiceListByPage({
          gwInstanceId: this.$route.query.gwInstanceId,
          engineType: 'higress',
          current: 1,
          size: 1000,
          ...(query
            ? { activeSearchName: 'serviceName', serviceName: query }
            : {}),
        })
          .then((res) => {
            if (res.code === 200) {
              this.originalBackendServiceList = res.data.records
              this.backendServiceList = res.data.records.map((item) => ({
                value: item.name,
                label: item.name,
              }))
            }
          })
          .finally(() => {
            this.serviceLoading = false
          })
      },
    },
  }
</script>

<style scoped>
  .el-form-item__extra {
    color: #888;
    font-size: 12px;
    margin-top: 4px;
  }
  .mcp-endpoint-item :deep(.el-form-item__content) {
    background-color: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
  }
</style>
