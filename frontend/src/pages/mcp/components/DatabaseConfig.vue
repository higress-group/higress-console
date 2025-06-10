<template>
  <el-form
    class="database-config-block"
    ref="formRef"
    :model="localValue"
    :rules="rules"
  >
    <div style="flex: 1">
      <div style="display: flex">
        <div class="block-title">认证类型</div>
        <div class="block-title" style="flex: 1; margin-left: 12px">
          认证凭证
        </div>
      </div>
      <div v-for="(item, idx) in localValue" :key="idx" class="config-row">
        <el-form-item
          :prop="`${idx}.type`"
          :rules="[
            { required: true, message: '请选择配置项', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="item.type"
            placeholder="配置项"
            style="width: 200px"
            disabled
          >
            <el-option
              v-for="option in DB_FIELDS"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :prop="`${idx}.defaultCredential`"
          :rules="[
            { required: true, message: '请输入配置值', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="item.defaultCredential"
            v-if="item.type !== 'dbType'"
            placeholder="配置值"
            style="width: 180px"
            :disabled="
              item.type === 'db_server_host' || item.type === 'db_server_port'
            "
            :type="item.type === 'db_password' ? 'password' : 'text'"
            :show-password="item.type === 'db_password'"
          />
          <el-select
            v-model="item.defaultCredential"
            v-if="item.type === 'dbType'"
            placeholder="配置值"
            style="width: 180px"
          >
            <el-option
              v-for="item in DB_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
  import { SERVICE_TYPE, DB_TYPE_OPTIONS, REG_DSN_STRING } from './constant'

  const DB_FIELDS = [
    { label: '数据库地址', value: 'db_server_host' },
    { label: '数据库端口', value: 'db_server_port' },
    { label: '数据库类型', value: 'dbType' },
    { label: '用户名', value: 'db_user_name' },
    { label: '密码', value: 'db_password' },
    { label: '数据库名', value: 'db_database' },
  ]

  const DB_FIXED_FIELDS = [
    {
      id: 'db_server_host',
      defaultCredential: '',
      type: 'db_server_host',
      scheme: 'db_server_host',
    },
    {
      id: 'db_server_port',
      defaultCredential: '',
      type: 'db_server_port',
      scheme: 'db_server_port',
    },
    { id: 'dbType', defaultCredential: '', type: 'dbType', scheme: 'dbType' },
    {
      id: 'db_user_name',
      defaultCredential: '',
      type: 'db_user_name',
      scheme: 'db_user_name',
    },
    {
      id: 'db_password',
      defaultCredential: '',
      type: 'db_password',
      scheme: 'db_password',
    },
    {
      id: 'db_database',
      defaultCredential: '',
      type: 'db_database',
      scheme: 'db_database',
    },
  ]

  export default {
    name: 'DatabaseConfig',
    props: {
      dbUrl: {
        type: String,
        default: '',
      },
      dbPort: {
        type: [String, Number],
        default: '',
      },
      dsn: {
        type: String,
        default: '',
      },
      dbType: {
        type: String,
        default: '',
      },
    },
    emits: ['change', 'validate'],
    data() {
      return {
        SERVICE_TYPE,
        DB_TYPE_OPTIONS,
        DB_FIELDS,
        localValue: JSON.parse(JSON.stringify(DB_FIXED_FIELDS)),
        rules: {
          defaultCredential: [
            { required: true, message: '请输入配置值', trigger: 'blur' },
          ],
        },
      }
    },
    mounted() {
      if (this.dsn) {
        const match = this.dsn.match(REG_DSN_STRING.DEFAULT)
        if (match) {
          // localValue 顺序：host, port, dbType, user, password, database
          this.localValue[0].defaultCredential = match[3] // host
          this.localValue[1].defaultCredential = match[4] // port
          // dbType 需要额外传递或从外部 props 获取，这里不处理
          this.localValue[3].defaultCredential = match[1] // user
          this.localValue[4].defaultCredential = match[2] // password
          this.localValue[5].defaultCredential = match[5] // database
        }
      }
      if (this.dbType) {
        this.localValue[2].defaultCredential = this.dbType
      }
    },
    watch: {
      localValue: {
        handler(val) {
          const dsn = `${val[3].defaultCredential}:${val[4].defaultCredential}@tcp(${val[0].defaultCredential}:${val[1].defaultCredential})/${val[5].defaultCredential}?charset=utf8mb4&parseTime=True&loc=Local`
          const dbType = val[2].defaultCredential
          this.$emit('change', dsn, dbType)
        },
        deep: true,
      },
      dbUrl: {
        handler(newVal) {
          this.localValue[0].defaultCredential = newVal
        },
      },
      dbPort: {
        handler(newVal) {
          this.localValue[1].defaultCredential = newVal
        },
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
    },
  }
</script>

<style scoped>
  .database-config-block {
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

  .config-row {
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
