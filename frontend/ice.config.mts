import { defineConfig } from "@ice/app";
import request from "@ice/plugin-request";
import store from "@ice/plugin-store";
import auth from "@ice/plugin-auth";

// The project config, see https://v3.ice.work/docs/guide/basic/config
export default defineConfig(() => ({
  ssr: false,
  ssg: false,
  hash: "contenthash",
  routes: {
    defineRoutes: (route) => {
      // route("*", "404.tsx");
    },
  },
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
  plugins: [request(), store(), auth()],
}));
