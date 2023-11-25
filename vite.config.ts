import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

path
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      components: `${path.resolve(__dirname, './src/components/')}`,
      pages: path.resolve(__dirname, './src/pages'),
      public: `${path.resolve(__dirname, './public/')}`
    }
  },
  server: {
    port: 8000
  }
})
