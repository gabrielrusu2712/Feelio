// Registers the service worker (public/sw.js) that makes Feelio installable and
// gives it an offline app shell. Only runs in production builds — in dev a SW
// would fight Vite's HMR — and is a safe no-op where service workers are
// unsupported or registration fails.

const register = async () => {
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch {
    // Non-fatal: the app works fine online without the service worker.
  }
}

export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    void register()
  })
}
