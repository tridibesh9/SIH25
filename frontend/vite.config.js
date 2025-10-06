import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser', // use Terser for minification
    terserOptions: {
      compress: {
        drop_console: false, // keep all console logs
        drop_debugger: false,
      },
    },
  },
});
