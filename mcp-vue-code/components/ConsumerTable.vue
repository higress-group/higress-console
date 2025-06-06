<template>
  <com-page @refresh="init">
    <template #action>
      <el-button
        type="primary"
        style="margin-right: 12px"
        @click="addConsumerAuthVisible = true"
      >
        授权
      </el-button>
      <com-high-search :search-params-list="list" />
    </template>
    <template #table>
      <el-table :data="data" style="width: 100%; margin-top: 16px">
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column label="消费者名称/ID">
          <template #default="scope">
            {{ scope.row.label || scope.row.consumerName || scope.row.name }}
            <span
              v-if="scope.row.value || scope.row.consumerId || scope.row.id"
            >
              / {{ scope.row.value || scope.row.consumerId || scope.row.id }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="授权范围">
          <template #default="scope">
            {{ scope.row.scope || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            {{ scope.row.status || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <slot name="actions" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
      <div class="consumer-footer">
        <el-checkbox disabled style="margin-right: 8px"></el-checkbox>
        <el-button type="default" size="small" disabled>批量解除授权</el-button>
      </div>
    </template>
    <template #pagination>
      <com-high-pagination :total="total" />
    </template>
    <AddConsumerAuth
      v-model="addConsumerAuthVisible"
      @added="handleAddConsumerAuthSubmit"
    />
  </com-page>
</template>

<script>
  import AddConsumerAuth from './AddConsumerAuth.vue'
  import { listConsumers } from '@/api/mcp'
  import ComPage from '@/components/com-page'
  import ComHighSearch from '@/components/com-high-search'
  import ComHighPagination from '@/components/com-high-pagination'
  export default {
    name: 'ConsumerTable',
    components: {
      AddConsumerAuth,
      ComPage,
      ComHighSearch,
      ComHighPagination,
    },
    data() {
      return {
        list: [
          {
            label: '消费者名称',
            name: 'consumerName',
            placeholder: '请输入消费者名称搜索',
          },
        ],
        addConsumerAuthVisible: false,
        data: [],
        total: 0,
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      '$route.query': {
        handler() {
          this.init()
        },
        deep: true,
      },
    },
    methods: {
      async getConsumerList() {
        const res = await listConsumers({
          mcpServerName: this.$route.params.mcpId,
          ...this.$route.query,
        })
        if (res.code === 200 && Array.isArray(res.data.records)) {
          this.data = res.data.records
          this.total = res.data.total || 0
        }
      },
      async init() {
        await this.getConsumerList()
      },
      handleAddConsumerAuthSubmit() {
        this.addConsumerAuthVisible = false
        this.$emit('added')
      },
    },
  }
</script>

<style scoped>
  .consumer-block {
    margin-top: 18px;
  }
  .consumer-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  .consumer-search-input {
    max-width: 340px;
  }
  .consumer-footer {
    display: flex;
    align-items: center;
    margin-top: 12px;
  }
</style>
