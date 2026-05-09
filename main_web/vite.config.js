import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      // Hosts that are allowed to reach the dev server. Vite 7 blocks
      // anything else with a 403. Behind nginx the request still arrives
      // with the public hostname in the Host header, so it must be listed.
      allowedHosts: (env.VITE_ALLOWED_HOSTS || "staging.peakglobalpartners.com,localhost,127.0.0.1")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      proxy: {
        "/api": {
          target: env.VITE_PROXY_API || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
