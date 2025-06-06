<template>
  <div>
    <el-table
      :data="data"
      style="width: 100%"
      v-loading="loading"
      highlight-current-row
    >
      <el-table-column prop="name" label="服务名称">
        <template #default="scope">
          <a @click="onDetail(scope.row)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template #default="scope">
          {{ scope.row.description || '默认描述' }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="服务类型">
        <template #default="scope">
          <el-tag type="info">{{ serviceTypeMap(scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140px">
        <template #default="scope">
          <action-buttons :actions="getActions(scope.row)" :max-visible="3" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { SERVICE_TYPE_MAP } from './constant'
  import ActionButtons from '@/components/ActionButtons'
  export default {
    name: 'TableList',
    components: { ActionButtons },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        hovered: null,
      }
    },
    methods: {
      serviceTypeMap(type) {
        return SERVICE_TYPE_MAP[type]
      },
      onDetail(row) {
        this.$emit('detail', row)
      },
      onOffline(row) {
        this.$emit('offline', row)
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
            key: 'edit',
            label: '编辑',
            handler: () => this.$emit('edit', row),
            order: 2,
          },
          {
            key: 'delete',
            label: '删除',
            handler: () => this.onOffline(row),
            order: 2,
          },
        ]
      },
    },
  }
</script>

<style scoped></style>
