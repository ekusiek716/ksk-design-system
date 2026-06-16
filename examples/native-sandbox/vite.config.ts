import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// react-native の import を react-native-web に解決し、パッケージ本体の native エントリを参照する。
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      // パッケージ本体の native エントリをそのまま消費（src/native が公開コードの単一の真実）。
      '@ksk-native': resolve(here, '../../src/native'),
      '@ksk-tokens': resolve(here, '../../src/tokens/native'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    __DEV__: JSON.stringify(true),
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react-native-web'],
    esbuildOptions: { resolveExtensions: ['.web.js', '.js', '.ts', '.tsx'] },
  },
  server: { port: 5191, host: true },
});
