import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/** Subpath on shared domain (e.g. /cms/). Must end with /. CI sets VITE_BASE_PATH=/cms/ */
function normalizeBase(path) {
  const p = (path || "/").trim() || "/";
  if (p === "/") return "/";
  return p.endsWith("/") ? p : `${p}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBase(env.VITE_BASE_PATH);
  return {
    base,
    plugins: [react()],
    server: {
      port: 5174,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
