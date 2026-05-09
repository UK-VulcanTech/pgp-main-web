import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE_PATH || "/cms/",
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5174,
      allowedHosts: (env.VITE_ALLOWED_HOSTS || "staging.peakglobalpartners.com,localhost,127.0.0.1")
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      proxy: {
        "/api": {
          target: env.VITE_PROXY_API || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
        // Static design images live in the main_web app — proxy them so
        // image_url previews like "/images/foo.webp" actually render here.
        "/images": {
          target: env.VITE_IMAGES_ORIGIN || "http://127.0.0.1:5173",
          changeOrigin: true,
        },
        // Uploaded media (Django ImageField) lives behind the API.
        "/media": {
          target: env.VITE_PROXY_API || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
