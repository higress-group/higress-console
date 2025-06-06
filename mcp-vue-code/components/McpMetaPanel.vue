<template>
  <com-card :title="panelTitle" header-border>
    <div style="margin-bottom: 12px">
      <el-button type="primary" @click="onAdd">{{ addBtnText }}</el-button>
    </div>
    <el-table :data="metaList" style="width: 100%">
      <template v-if="type === 'resource'">
        <el-table-column prop="name" label="资源名称" min-width="120" />
        <el-table-column prop="uri" label="URI" min-width="200" />
        <el-table-column prop="mimeType" label="MIME类型" min-width="120" />
      </template>
      <template v-else>
        <el-table-column prop="name" label="Prompt名称" min-width="120" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column label="参数" min-width="200">
          <template #default="scope">
            <div v-if="scope.row.arguments && scope.row.arguments.length">
              <div v-for="arg in scope.row.arguments" :key="arg.name">
                <b>{{ arg.name }}</b>
                <span v-if="arg.required" style="color: #f56c6c">*</span>
                : {{ arg.description }}
              </div>
            </div>
            <span v-else>无</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </com-card>
</template>

<script>
  export default {
    name: 'McpMetaPanel',
    props: {
      type: { type: String, required: true }, // 'resource' | 'prompt'
      metaList: { type: Array, required: true },
    },
    computed: {
      panelTitle() {
        return this.type === 'resource' ? '资源' : 'Prompt'
      },
      addBtnText() {
        return this.type === 'resource' ? '新增资源' : '新增Prompt'
      },
    },
    methods: {
      onAdd() {
        this.$emit('add')
      },
    },
  }
</script>
