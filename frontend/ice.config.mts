import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';

// The project config, see https://v3.ice.work/docs/guide/basic/config
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  routes: {
    defineRoutes: (route) => {
      if (process.platform !== 'win32') {
        route('*', '404.tsx');
      }
    },
  },
  proxy: {
    '/api': {
      target: 'http://demo.higress.io/',
      changeOrigin: true,
      pathRewrite: { '^/api' : '' },
    },
  },
  plugins: [
    request(),
    store(),
    auth(),
  ],
}));
