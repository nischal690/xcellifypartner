// vite.config.js
import { defineConfig } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { viteExternalsPlugin } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite-plugin-externals/dist/src/index.js";
import { VitePWA } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\dd\\Desktop\\xcellify-vendor-1";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      api_domain_url: ["XcellifyURLConfig", "api_domain_url"]
    }),
    VitePWA({
      registerType: "prompt",
      // Ensures install prompt appears
      manifest: {
        name: "Xcellify Partner Portal",
        short_name: "Xcellify",
        description: "Xcellify Partner Portal",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      devOptions: {
        enabled: true
        // Enables PWA in dev mode for testing
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globIgnores: ["**/ort-wasm-simd-threaded*.wasm"]
      }
    })
  ],
  resolve: {
    alias: {
      // Add aliases for problematic packages
      "pizzip": path.resolve(__vite_injected_original_dirname, "node_modules/pizzip/dist/pizzip.js")
    }
  },
  server: {
    host: "0.0.0.0",
    // Allows external devices to connect
    port: 5174,
    strictPort: true,
    allowedHosts: [".ngrok-free.app"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZFxcXFxEZXNrdG9wXFxcXHhjZWxsaWZ5LXZlbmRvci0xXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZFxcXFxEZXNrdG9wXFxcXHhjZWxsaWZ5LXZlbmRvci0xXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kZC9EZXNrdG9wL3hjZWxsaWZ5LXZlbmRvci0xL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgdml0ZUV4dGVybmFsc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWV4dGVybmFscyc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpdGVFeHRlcm5hbHNQbHVnaW4oe1xuICAgICAgYXBpX2RvbWFpbl91cmw6IFsnWGNlbGxpZnlVUkxDb25maWcnLCAnYXBpX2RvbWFpbl91cmwnXSxcbiAgICB9KSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ3Byb21wdCcsIC8vIEVuc3VyZXMgaW5zdGFsbCBwcm9tcHQgYXBwZWFyc1xuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ1hjZWxsaWZ5IFBhcnRuZXIgUG9ydGFsJyxcbiAgICAgICAgc2hvcnRfbmFtZTogJ1hjZWxsaWZ5JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdYY2VsbGlmeSBQYXJ0bmVyIFBvcnRhbCcsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvbG9nbzE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2xvZ281MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gRW5hYmxlcyBQV0EgaW4gZGV2IG1vZGUgZm9yIHRlc3RpbmdcbiAgICAgIH0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiA1MCAqIDEwMjQgKiAxMDI0LFxuICAgICAgICBnbG9iSWdub3JlczogWycqKi9vcnQtd2FzbS1zaW1kLXRocmVhZGVkKi53YXNtJ10sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vIEFkZCBhbGlhc2VzIGZvciBwcm9ibGVtYXRpYyBwYWNrYWdlc1xuICAgICAgJ3BpenppcCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvcGl6emlwL2Rpc3QvcGl6emlwLmpzJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLCAvLyBBbGxvd3MgZXh0ZXJuYWwgZGV2aWNlcyB0byBjb25uZWN0XG4gICAgcG9ydDogNTE3NCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIGFsbG93ZWRIb3N0czogWycubmdyb2stZnJlZS5hcHAnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUyxTQUFTLG9CQUFvQjtBQUN4VSxPQUFPLFdBQVc7QUFDbEIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixvQkFBb0I7QUFBQSxNQUNsQixnQkFBZ0IsQ0FBQyxxQkFBcUIsZ0JBQWdCO0FBQUEsSUFDeEQsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBO0FBQUEsTUFDZCxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUE7QUFBQSxNQUNYO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCwrQkFBK0IsS0FBSyxPQUFPO0FBQUEsUUFDM0MsYUFBYSxDQUFDLGlDQUFpQztBQUFBLE1BQ2pEO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxvQ0FBb0M7QUFBQSxJQUN4RTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osY0FBYyxDQUFDLGlCQUFpQjtBQUFBLEVBQ2xDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
