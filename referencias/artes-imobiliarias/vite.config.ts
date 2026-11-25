import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { creativeApi } from './creative-api';
import { authApi } from './auth-api';
import { originalApi } from './original-api';
import { clientApi } from './client-api';
import { historyApi } from './history-api';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '127.0.0.1',
      },
      plugins: [react(), authApi(), creativeApi(), originalApi(), clientApi(), historyApi()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
