<template>
  <el-drawer
    v-model="localVisible"
    title="添加域名"
    size="600px"
    @close="onClose"
  >
    <el-form label-width="80px" :model="form">
      <el-form-item label="域名" required>
        <el-input-group style="width: 100%">
          <el-select v-model="form.protocol" style="width: 100px">
            <el-option label="HTTP" value="http" />
            <el-option label="HTTPS" value="https" />
          </el-select>
          <el-input
            v-model="form.domain"
            placeholder="请输入域名，如 www.hello.com"
            maxlength="128"
            style="width: calc(100% - 100px)"
          />
        </el-input-group>
        <div style="color: #888; font-size: 12px; margin-top: 4px">
          支持完整域名（www.hello.com）、泛域名（*.hello.com）以及"*"域名，"*"域名主要用于暂时无域名的场景，支持IP访问，存在安全风险，请谨慎使用。
          有关域名匹配的详细规则，请
          <a
            href="https://cloud.tencent.com/document/product/626/10647"
            target="_blank"
          >
            参考文档
          </a>
          。
        </div>
      </el-form-item>

      <el-collapse v-model="advancedOpen" style="margin-bottom: 16px">
        <el-collapse-item name="advanced" title="高级配置">
          <el-form-item label="资源组" required>
            <el-select v-model="form.resourceGroup" style="width: 100%">
              <el-option label="默认资源组" value="default" />
              <el-option label="test-Q22" value="test-Q22" />
            </el-select>
            <el-button
              type="text"
              @click="onCreateResourceGroup"
              style="margin-left: 8px"
            >
              创建资源组
            </el-button>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div style="text-align: right">
      <el-button @click="localVisible = false">取消</el-button>
      <el-button type="primary" @click="onCreate">创建</el-button>
    </div>
  </el-drawer>
</template>

<script>
  export default {
    props: { visible: Boolean },
    emits: ['update:visible', 'created'],
    data() {
      return {
        localVisible: this.visible,
        form: {
          protocol: 'http',
          domain: '',
          resourceGroup: 'default',
        },
        advancedOpen: ['advanced'],
      }
    },
    watch: {
      visible: {
        handler(newVal) {
          console.log('visible', newVal)
          this.localVisible = newVal
        },
      },
    },
    methods: {
      onCreate() {
        // 校验并回传
        this.$emit('created', this.form)
        this.$emit('update:visible', false)
      },
      onCreateResourceGroup() {
        // 这里可以弹窗或跳转到资源组创建页面
        this.$message.info('请在资源组管理页面创建资源组')
      },
      onClose() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>
