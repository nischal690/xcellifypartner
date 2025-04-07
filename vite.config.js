import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      api_domain_url: ['XcellifyURLConfig', 'api_domain_url'],
    }),
    VitePWA({
      registerType: 'prompt', // Ensures install prompt appears
      manifest: {
        name: 'Xcellify Partner Portal',
        short_name: 'Xcellify',
        description: 'Xcellify Partner Portal',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enables PWA in dev mode for testing
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globIgnores: ['**/ort-wasm-simd-threaded*.wasm'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // Allows external devices to connect
    port: 5173,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app'],
  },
});
