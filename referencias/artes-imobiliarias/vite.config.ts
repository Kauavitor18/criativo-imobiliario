import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { creativeApi } from './creative-api';
import { authApi } from './auth-api';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '127.0.0.1',
      },
      plugins: [react(), authApi(), creativeApi()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
