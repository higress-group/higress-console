<template>
  <el-form
    class="security-schemes-block"
    ref="formRef"
    :model="localValue"
    :rules="rules"
  >
    <div v-if="!hideLabel" class="block-title">后端服务认证</div>
    <div style="flex: 1">
      <div style="display: flex">
        <div class="block-title">认证类型</div>
        <div class="block-title" style="flex: 1; margin-left: 12px">
          认证凭证
        </div>
      </div>
      <div v-for="(item, idx) in localValue" :key="idx" class="security-row">
        <el-form-item
          :prop="`${idx}.type`"
          :rules="[
            { required: true, message: '请选择认证类型', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="item.type"
            placeholder="认证类型"
            style="width: 200px"
          >
            <el-option
              v-for="option in currentOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :prop="`${idx}.defaultCredential`"
          :rules="[
            { required: true, message: '请输入凭证值', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.defaultCredential"
            placeholder="凭证值"
            style="width: 180px"
          />
        </el-form-item>
        <template v-if="item.type === 'API Key'">
          <el-form-item
            :prop="`${idx}.in`"
            :rules="[
              {
                required: true,
                message: '请选择凭证位置',
                trigger: 'change',
              },
            ]"
          >
            <el-select
              v-model="item.in"
              placeholder="凭证位置"
              style="width: 100px"
            >
              <el-option label="header" value="header"></el-option>
              <el-option label="query" value="query"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="`${idx}.name`"
            :rules="[{ required: true, message: '请输入Key', trigger: 'blur' }]"
          >
            <el-input
              v-model="item.name"
              placeholder="Key"
              style="width: 120px"
            />
          </el-form-item>
        </template>
        <el-button
          type="text"
          icon="el-icon-delete"
          @click="removeScheme(idx)"
          v-if="localValue.length > 0"
        />
      </div>
      <el-button type="text" icon="el-icon-circle-plus" @click="addScheme">
        {{ '添加' }}
      </el-button>
    </div>
  </el-form>
</template>

<script>
  import { SERVICE_TYPE } from './constant'

  const SECURITY_SCHEME_OPTIONS = {
    [SERVICE_TYPE.OPENAPI]: [
      { label: 'Basic', value: 'Basic' },
      { label: 'Bearer', value: 'Bearer' },
      { label: 'API Key', value: 'API Key' },
    ],
  }

  export default {
    name: 'SecuritySchemesForm',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
      serviceType: {
        type: String,
        default: SERVICE_TYPE.OPENAPI,
        validator: (value) => {
          return Object.values(SERVICE_TYPE).includes(value)
        },
      },
    },
    emits: ['update:modelValue', 'validate'],
    data() {
      return {
        SERVICE_TYPE,
        localValue: JSON.parse(JSON.stringify(this.modelValue)),
        rules: {
          defaultCredential: [
            { required: true, message: '请输入凭证值', trigger: 'blur' },
          ],
        },
      }
    },
    watch: {
      localValue: {
        handler(val) {
          this.$nextTick(() => {
            this.$emit('update:modelValue', JSON.parse(JSON.stringify(val)))
          })
        },
        deep: true,
      },
    },
    computed: {
      currentOptions() {
        return SECURITY_SCHEME_OPTIONS[this.serviceType] || []
      },
    },
    methods: {
      validate() {
        return new Promise((resolve, reject) => {
          this.$refs.formRef.validate((valid) => {
            if (valid) {
              resolve(true)
            } else {
              reject(new Error('表单验证失败'))
            }
          })
        })
      },
      addScheme() {
        this.localValue.push({
          id: '',
          defaultCredential: '',
          type: 'Bearer',
          scheme: 'Bearer',
          in: '',
          name: '',
        })
      },
      removeScheme(idx) {
        this.localValue.splice(idx, 1)
      },
    },
  }
</script>

<style scoped>
  .security-schemes-block {
    background: #f7f8fa;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
  }

  .block-title {
    font-weight: bold;
    margin-bottom: 8px;
    width: 200px;
  }

  .security-row {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
  }

  .is-required::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
</style>
