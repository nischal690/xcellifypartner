// vite.config.js
import { defineConfig } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { viteExternalsPlugin } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite-plugin-externals/dist/src/index.js";
import { VitePWA } from "file:///C:/Users/dd/Desktop/xcellify-vendor-1/node_modules/vite-plugin-pwa/dist/index.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZFxcXFxEZXNrdG9wXFxcXHhjZWxsaWZ5LXZlbmRvci0xXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZFxcXFxEZXNrdG9wXFxcXHhjZWxsaWZ5LXZlbmRvci0xXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kZC9EZXNrdG9wL3hjZWxsaWZ5LXZlbmRvci0xL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgdml0ZUV4dGVybmFsc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWV4dGVybmFscyc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB2aXRlRXh0ZXJuYWxzUGx1Z2luKHtcbiAgICAgIGFwaV9kb21haW5fdXJsOiBbJ1hjZWxsaWZ5VVJMQ29uZmlnJywgJ2FwaV9kb21haW5fdXJsJ10sXG4gICAgfSksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdwcm9tcHQnLCAvLyBFbnN1cmVzIGluc3RhbGwgcHJvbXB0IGFwcGVhcnNcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdYY2VsbGlmeSBQYXJ0bmVyIFBvcnRhbCcsXG4gICAgICAgIHNob3J0X25hbWU6ICdYY2VsbGlmeScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnWGNlbGxpZnkgUGFydG5lciBQb3J0YWwnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2xvZ28xOTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9sb2dvNTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIEVuYWJsZXMgUFdBIGluIGRldiBtb2RlIGZvciB0ZXN0aW5nXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogNTAgKiAxMDI0ICogMTAyNCxcbiAgICAgICAgZ2xvYklnbm9yZXM6IFsnKiovb3J0LXdhc20tc2ltZC10aHJlYWRlZCoud2FzbSddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLCAvLyBBbGxvd3MgZXh0ZXJuYWwgZGV2aWNlcyB0byBjb25uZWN0XG4gICAgcG9ydDogNTE3NCxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIGFsbG93ZWRIb3N0czogWycubmdyb2stZnJlZS5hcHAnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUyxTQUFTLG9CQUFvQjtBQUN4VSxPQUFPLFdBQVc7QUFDbEIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLG9CQUFvQjtBQUFBLE1BQ2xCLGdCQUFnQixDQUFDLHFCQUFxQixnQkFBZ0I7QUFBQSxJQUN4RCxDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUE7QUFBQSxNQUNkLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxRQUNULFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQTtBQUFBLE1BQ1g7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLCtCQUErQixLQUFLLE9BQU87QUFBQSxRQUMzQyxhQUFhLENBQUMsaUNBQWlDO0FBQUEsTUFDakQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGNBQWMsQ0FBQyxpQkFBaUI7QUFBQSxFQUNsQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
