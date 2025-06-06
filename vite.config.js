// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Your existing “@” alias for all React code under src/
      "@": path.resolve(__dirname, "./src"),

      // Stub out any import of "src/db.js" so Vite never tries to bundle `pg`
      // (match the literal import path “src/db.js” as used in your code)
      "src/db.js": path.resolve(__dirname, "./src/emptyDbStub.js"),

      // Ensure that if anything tries to import "pg" or "cloudflare:sockets" directly,
      // Vite treats them as empty modules.
      pg: false,
      "pg-native": false,
      "pg-protocol": false,
      "pg-connection-string": false,
      "cloudflare:sockets": false,
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // ← your backend port
        changeOrigin: true,
      },
    },
  },

  optimizeDeps: {
    // Prevent Vite from trying to pre-bundle pg or its submodules
    exclude: ["pg", "pg-native", "pg-protocol", "pg-connection-string"],
  },

  ssr: {
    // When doing SSR builds, keep pg external
    noExternal: ["pg", "pg-native", "pg-protocol", "pg-connection-string"],
  },
});
