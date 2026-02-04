import react from '@vitejs/plugin-react';
//import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  base: '/hitscord-frontend',
  /*server: {
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    host: '192.168.0.12',
    port: 5173,
  },*/
});
