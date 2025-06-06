<template>
  <el-drawer
    title="编辑工具"
    size="1000px"
    @close="handleClose"
    destroy-on-close
  >
    <step-title>编辑方式</step-title>
    <div class="edit-mode-switch">
      <el-card
        style="flex: 1"
        :class="{ active: mode === 'swagger' }"
        @click="mode = 'swagger'"
      >
        <div>基于Swagger文件</div>
        <div class="desc">上传Swagger文件自动生成MCP工具</div>
      </el-card>
      <el-card
        style="flex: 1"
        :class="{ active: mode === 'yaml' }"
        @click="mode = 'yaml'"
      >
        <div>自定义YAML</div>
        <div class="desc">手动创建MCP工具</div>
      </el-card>
    </div>

    <!-- 自定义YAML模式 -->
    <template v-if="mode === 'yaml'">
      <step-title>MCP工具列表</step-title>
      <!-- <security-schemes-form
        v-model="securitySchemes"
        ref="customYamlSecuritySchemesForm"
        :service-type="serviceType"
        @validate="handleValidate"
      /> -->
      <com-monaco-editor
        v-model="localRawConfigurations"
        :opts="{ language: 'yaml', theme: 'vs-dark' }"
        style="height: 400px; margin-bottom: 10px"
      />
      <!-- <el-button type="default" @click="handleYamlExample">yaml示例</el-button> -->
    </template>

    <!-- 基于Swagger文件模式 -->
    <template v-else>
      <div style="margin-bottom: 24px">
        <step-title>step 1. 导入Swagger，创建或增量更新MCP工具</step-title>
        <com-monaco-editor
          v-model="swaggerContentStr"
          :opts="{ language: 'yaml', theme: 'vs-dark' }"
          style="height: 400px"
        />
        <el-button
          type="primary"
          style="margin-top: 12px"
          @click="handleSwaggerParse"
        >
          立即生成
        </el-button>
      </div>
      <div>
        <step-title>step 2. 更新及确认MCP工具列表</step-title>
        <!-- <security-schemes-form
          v-model="securitySchemes"
          ref="swaggerSecuritySchemesForm"
          :service-type="serviceType"
          @validate="handleValidate"
        /> -->

        <div style="display: flex; gap: 16px">
          <div style="flex: 1">
            <div style="margin-bottom: 4px">当前Swagger文件对应的工具列表</div>
            <com-monaco-editor
              v-model="swaggerToolsContent"
              :opts="{ language: 'yaml', theme: 'vs-dark', readOnly: true }"
              style="height: 400px"
            />
          </div>
          <div style="flex: 1">
            <div style="margin-bottom: 4px">最终MCP工具列表（可手动修改）</div>
            <com-monaco-editor
              v-model="localRawConfigurations"
              :opts="{ language: 'yaml', theme: 'vs-dark' }"
              style="height: 400px"
            />
          </div>
        </div>
      </div>
    </template>
    <div class="bottom-space" style="height: 50px"></div>
    <div class="drawer__footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
  import ComMonacoEditor from '@/components/com-monaco-editor'
  import StepTitle from './StepTitle.vue'
  // import SecuritySchemesForm from './SecuritySchemesForm.vue'
  import YamlUtil from './yamlUtil'
  import { swaggerToMcpConfig } from '@/api/mcp'
  export default {
    name: 'EditToolDrawer',
    components: { ComMonacoEditor, StepTitle },
    props: {
      rawConfigurations: {
        type: String, // 或根据实际情况定义其他类型
        default: '',
      },
      serviceType: {
        type: String,
        default: 'OpenAPI',
      },
    },
    emits: ['update:modelValue', 'update:rawConfigurations', 'submit'],
    data() {
      return {
        mode: 'yaml',
        yamlContent: '',
        swaggerContentStr: '', // 字符串，编辑器用
        swaggerToolsContent: '',
        finalToolsContent: '',
        // securitySchemes: [],
        localRawConfigurations: '',
      }
    },
    watch: {
      rawConfigurations: {
        handler(val) {
          if (val === this.localRawConfigurations) {
            return
          }
          this.localRawConfigurations = val
        },
        immediate: true,
      },
    },
    methods: {
      handleValidate(...args) {
        // this.$refs.customYamlSecuritySchemesForm.validate()
        console.log('args', args)
      },
      handleYamlExample() {
        const yamlObj = YamlUtil.createNewYaml()
        // if (this.securitySchemes.length) {
        //   yamlObj.server.securitySchemes = this.securitySchemes
        // }
        if (this.tool) {
          yamlObj.tools.push(this.tool)
        }
        try {
          console.log('yamlObj', yamlObj)
          this.yamlContent = YamlUtil.stringifyYaml(yamlObj)
          console.log('yamlContent', this.yamlContent)
        } catch (e) {
          this.$message.error('YAML序列化错误')
        }
      },
      handleClose() {
        this.$emit('update:modelValue', false)
      },
      handleSubmit() {
        if (this.mode === 'yaml') {
          // this.$refs.customYamlSecuritySchemesForm.validate().then((valid) => {
          //   if (valid) {
          //     this.$emit(
          //       'submit',
          //       this.localRawConfigurations,
          //       this.securitySchemes
          //     )
          //   }
          // })
          this.$emit('submit', this.localRawConfigurations)
        } else {
          // this.$refs.swaggerSecuritySchemesForm.validate().then((valid) => {
          //   if (valid) {
          //     this.$emit(
          //       'submit',
          //       this.localRawConfigurations,
          //       this.securitySchemes
          //     )
          //   }
          // })
          this.$emit('submit', this.localRawConfigurations)
        }
      },
      handleSwaggerParse() {
        if (!this.swaggerContentStr.trim()) {
          this.$message.warning('请粘贴Swagger JSON内容')
          return
        }
        swaggerToMcpConfig({
          content: this.swaggerContentStr,
          gwInstanceId: this.$route.query.gwInstanceId,
        }).then((res) => {
          // 解析返回的 YAML 字符串
          let swaggerObj = {}
          try {
            swaggerObj = YamlUtil.parseYaml(res.data) || {}
          } catch (e) {
            this.$message.error('解析返回的 YAML 数据失败')
            return
          }

          // 合并 securitySchemes
          if (!swaggerObj.server) {
            swaggerObj.server = {}
          }

          // 更新 swaggerToolsContent
          this.swaggerToolsContent = YamlUtil.stringifyYaml(swaggerObj)

          // 更新 finalToolsContent
          let finalObj = {}
          try {
            finalObj = YamlUtil.parseYaml(this.localRawConfigurations) || {}
          } catch (e) {
            finalObj = {}
          }

          // 合并工具列表
          if (!finalObj.server) {
            finalObj.server = {}
          }
          if (!finalObj.tools) {
            finalObj.tools = []
          }

          // 合并新的工具到现有工具列表中
          if (swaggerObj.server) {
            finalObj.server = {
              ...finalObj.server,
              ...swaggerObj.server,
            }
          }
          if (swaggerObj.tools) {
            finalObj.tools = [...finalObj.tools, ...swaggerObj.tools]
          }

          this.localRawConfigurations = YamlUtil.stringifyYaml(finalObj)
        })
        this.$message.success('解析成功，可继续编辑最终MCP工具列表')
      },
      resetForm() {
        this.localRawConfigurations = this.rawConfigurations
        this.swaggerContentStr = ''
        this.swaggerToolsContent = ''
        this.localRawConfigurations = ''
        // this.securitySchemes = []
      },
    },
  }
</script>

<style scoped>
  .edit-mode-switch {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .edit-mode-switch .el-card {
    cursor: pointer;
    width: 220px;
    border: 1px solid #e0e0e0;
    transition: border 0.2s, box-shadow 0.2s;
  }

  .edit-mode-switch .el-card.active {
    border: 2px solid #409eff;
    box-shadow: 0 2px 8px #409eff22;
  }

  .edit-mode-switch .desc {
    color: #888;
    font-size: 12px;
    margin-top: 4px;
  }

  .security-row {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
  }
</style>
