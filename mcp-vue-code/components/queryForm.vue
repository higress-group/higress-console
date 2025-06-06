<template>
  <com-high-search :search-params-list="list"></com-high-search>
</template>

<script>
  import ComHighSearch from '@/components/com-high-search'
  import { SERVICE_TYPE } from './constant'
  export default {
    name: 'QueryForm',
    components: { ComHighSearch },
    props: {},
    data() {
      return {
        list: [
          {
            label: 'MCP服务名称',
            name: 'name',
            placeholder: '请输入MCP服务名称搜索',
          },
          {
            label: 'MCP服务类型',
            name: 'type',
            placeholder: '请选择MCP服务类型',
            type: 'select',
            optionList: [
              { label: 'OpenAPI', value: SERVICE_TYPE.OPENAPI },
              { label: 'DB', value: SERVICE_TYPE.DB },
              { label: '直接路由', value: SERVICE_TYPE.REDIRECT_ROUTE },
            ],
          },
        ],
      }
    },
    created() {},
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
