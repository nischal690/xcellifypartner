import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteExternalsPlugin } from 'vite-plugin-externals';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      api_domain_url: ['XcellifyURLConfig', 'api_domain_url']
    })
  ],
})
