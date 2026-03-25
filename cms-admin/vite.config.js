import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rawBase = env.VITE_BASE_PATH || "/";
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

  return {
    base,
    plugins: [react()],
    server: {
      host: true,
      port: 5174,
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_API || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
