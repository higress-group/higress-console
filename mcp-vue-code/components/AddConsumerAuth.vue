<template>
  <el-drawer
    title="添加消费者授权"
    @close="handleClose"
    destroy-on-close
    size="700px"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      label-position="left"
      :rules="rules"
    >
      <el-form-item label="授权范围">MCP服务</el-form-item>
      <el-form-item label="消费者" prop="consumerId">
        <el-select
          v-model="formData.consumerId"
          placeholder="请选择消费者"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in consumerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="drawer__footer">
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="handleAddConsumerAuth">添加</el-button>
    </div>
  </el-drawer>
</template>

<script>
  import { getAppListByPage } from '@/api/application'
  import { addConsumers } from '@/api/mcp'
  export default {
    name: 'AddConsumerAuth',
    props: {
      mcpName: {
        type: String,
        default: '',
      },
      strategyConfigId: {
        type: String,
        default: '',
      },
    },
    emits: ['update:modelValue', 'added'],
    data() {
      return {
        formData: {
          consumerId: '',
        },
        consumerList: [],
        rules: {
          consumerId: [
            { required: true, message: '请选择消费者', trigger: 'blur' },
          ],
        },
      }
    },
    mounted() {
      this.fetchConsumerList()
    },
    methods: {
      async fetchConsumerList() {
        try {
          const res = await getAppListByPage({ pageNo: 1, pageSize: 100 })
          if (res && res.data && Array.isArray(res.data.records)) {
            this.consumerList = res.data.records.map((item) => ({
              label: item.appName,
              value: item.appId,
            }))
          }
        } catch (e) {
          this.$message.error('获取消费者列表失败')
        }
      },
      handleAddConsumerAuth() {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            addConsumers({
              mcpServerName: this.$route.params.mcpId,
              consumers: [this.formData.consumerId],
            }).then((res) => {
              if (res.code === 200) {
                this.$message.success('授权成功')
                this.$emit('update:modelValue', false)
                this.$emit('added')
              }
            })
          }
        })
      },
      handleClose() {
        this.$refs.formRef.resetFields()
        this.$emit('update:modelValue', false)
      },
    },
  }
</script>
