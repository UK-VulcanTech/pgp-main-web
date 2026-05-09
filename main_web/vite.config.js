import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Append a build-time cache-buster to fixed-URL static files referenced
// from index.html (the ones not handled by Vite's hashed /assets/ pipeline).
// Without this, /css/style.css and friends cache aggressively on the CDN
// and in browsers, and visitors keep seeing stale CSS after a deploy.
function bustStaticCache() {
  const v = String(Date.now());
  return {
    name: "bust-static-cache",
    transformIndexHtml(html) {
      return html
        .replace(/href="(\/css\/[^"?]+)"/g, `href="$1?v=${v}"`)
        .replace(/src="(\/js\/[^"?]+)"/g, `src="$1?v=${v}"`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), bustStaticCache()],
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
