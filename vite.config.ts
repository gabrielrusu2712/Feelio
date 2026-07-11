/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    // Heavy page-render tests (e.g. wellbeing's sky-climb) can exceed the 5s
    // default when the whole suite runs on a slow/loaded machine. Give real
    // headroom so timing flakiness doesn't fail the run; true hangs still fail.
    testTimeout: 15000,
    hookTimeout: 15000,
    // Dummy Firebase config so the SDK singletons construct without throwing
    // in unit tests. No network calls are made unless explicitly invoked.
    env: {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test',
      VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '0',
      VITE_FIREBASE_APP_ID: 'test-app-id',
      VITE_CHAT_WORKER_URL: 'https://chat.test.workers.dev',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.styled.ts',
        'src/**/*.d.ts',
        'test/**',
        'src/main.tsx',
      ],
    },
  },
  server: {
    host: true,
  },
})
