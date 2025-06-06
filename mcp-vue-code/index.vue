<template>
  <com-page @refresh="getList">
    <template #title>MCP管理</template>
    <template #action>
      <el-button type="primary" @click="onCreate">创建 MCP 服务</el-button>
      <query-form></query-form>
    </template>
    <template #table>
      <table-list
        :data="filteredList"
        @detail="onDetail"
        @edit="onEdit"
        @offline="onOffline"
        @actions="getActions"
        :loading="loading"
      />
    </template>
    <template #pagination>
      <com-high-pagination :total="total"></com-high-pagination>
    </template>
    <mcp-form-drawer
      v-model="drawerVisible"
      :is-edit="drawerEdit"
      :form-data="drawerFormData"
      @submit="handleDrawerSubmit"
    />
  </com-page>
</template>

<script>
  import ComPage from '@/components/com-page'
  import McpFormDrawer from './components/McpFormDrawer.vue'
  import QueryForm from './components/queryForm.vue'
  import TableList from './components/tableList.vue'
  import {
    listMcpServers,
    deleteMcpServer,
    createMcpServer,
    getMcpServer,
  } from '@/api/mcp'
  import ComHighPagination from '@/components/com-high-pagination'
  export default {
    name: 'Mcp',
    components: {
      ComPage,
      McpFormDrawer,
      QueryForm,
      TableList,
      ComHighPagination,
    },
    data() {
      return {
        total: 0,
        search: '',
        status: '',
        drawerVisible: false,
        drawerEdit: false,
        drawerFormData: null,
        offlineItem: null,
        loading: false,
        tableData: [],
        gwInstanceId: '',
      }
    },
    computed: {
      filteredList() {
        return this.tableData.filter((item) => {
          const matchName = !this.search || item.name.includes(this.search)
          const matchStatus = !this.status || item.status === this.status
          return matchName && matchStatus
        })
      },
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList(query = this.$route.query) {
        this.loading = true
        listMcpServers({
          ...query,
          current: Number(query.current) || 1,
          size: Number(query.size) || 10,
        })
          .then((res) => {
            const { data } = res
            const { records, total, current, size } = data
            if (res.code === 200) {
              this.tableData = records
              this.total = Number(total)
              this.$route.query.current = current
              this.$route.query.size = size
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      onCreate() {
        this.drawerVisible = true
        this.drawerEdit = false
        this.drawerFormData = null
      },
      onSearch() {
        // 实时过滤
      },
      onFilter() {
        // 状态筛选
      },
      onDetail(item) {
        this.$router.push({
          path: `/mcp/${item.name}`,
        })
      },
      async onEdit(item) {
        this.drawerEdit = true
        const res = await getMcpServer({
          mcpServerName: item.name,
        })
        if (res.code === 200) {
          this.drawerFormData = res.data
          this.drawerVisible = true
        }
      },
      onOffline(item) {
        this.offlineItem = item
        this.$confirm('确认删除该MCP服务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.handleOfflineConfirm()
          })
          .catch(() => {
            this.handleOfflineCancel()
          })
      },
      handleOfflineConfirm() {
        deleteMcpServer({
          gwInstanceId: this.gwInstanceId,
          mcpServerName: this.offlineItem.name,
        })
          .then((res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
          .finally(() => {
            this.offlineItem = null
          })
      },
      handleDrawerSubmit(form) {
        createMcpServer(form).then((res) => {
          if (res.code === 200) {
            this.$message.success('创建成功')
            this.getList()
            this.drawerVisible = false
          }
        })
      },
      getActions(row) {
        return [
          {
            key: 'detail',
            label: '详情',
            handler: () => this.onDetail(row),
            order: 1,
          },
          {
            key: 'offline',
            label: '删除',
            handler: () => this.onOffline(row),
            order: 2,
          },
        ]
      },
    },
  }
</script>

<style scoped>
  /* 可根据实际UI调整样式 */
</style>
