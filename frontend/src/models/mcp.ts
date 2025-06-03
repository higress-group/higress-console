export default {
  state: {
    configurations: [],
    loading: false,
    total: 0,
    page: 1,
    pageSize: 10,
  },
  reducers: {
    updateState(state, payload) {
      return { ...state, ...payload };
    },
  },
  effects: (dispatch) => ({
    async getMCPConfigs(params) {
      dispatch.mcp.updateState({ loading: true });
      try {
        // This would be replaced with actual API calls
        setTimeout(() => {
          const mockData = Array.from({ length: 12 }, (_, i) => ({
            id: `mcp-${i + 1}`,
            name: `MCP 配置 ${i + 1}`,
            description: `这是第 ${i + 1} 个 MCP 配置`,
            sourceType: i % 3 === 0 ? 'REST' : i % 3 === 1 ? 'DB' : 'INTERNAL',
            enabled: i % 4 !== 0,
            createdAt: '2023-09-20T09:12:12Z',
            updatedAt: '2023-09-20T09:12:12Z',
          }));
          
          const start = (params.page - 1) * params.pageSize;
          const end = start + params.pageSize;
          const paginatedData = mockData.slice(start, end);
          
          dispatch.mcp.updateState({
            configurations: paginatedData,
            total: mockData.length,
            page: params.page,
            pageSize: params.pageSize,
            loading: false,
          });
        }, 500);
      } catch (error) {
        dispatch.mcp.updateState({ loading: false });
      }
    },
  }),
};