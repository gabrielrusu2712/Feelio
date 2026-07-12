import { useCallback, useEffect, useState } from 'react'

// Drives the "install this app" control in Settings, adapting to the platform:
//  - 'prompt' → Chromium (Android/desktop) fired `beforeinstallprompt`, so we can
//    trigger the native install dialog from our own button.
//  - 'ios'    → Safari on iPhone/iPad, which NEVER fires that event; the only way
//    to install is the manual Share → "Add to Home Screen", so we show a hint.
//  - 'none'   → nothing to offer (already installed, or the browser can't install).
export type InstallKind = 'none' | 'prompt' | 'ios'

// Chromium's non-standard install event (not in the DOM lib types).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// An inline script in index.html captures `beforeinstallprompt` before React
// mounts (it can fire that early) and stashes it here.
declare global {
  interface Window {
    __feelioBIP?: BeforeInstallPromptEvent | null
  }
}

const capturedEvent = (): BeforeInstallPromptEvent | null => window.__feelioBIP ?? null

// True when the app is already running as an installed PWA (so never offer install).
const isStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true

// iOS/iPadOS Safari — and not another browser engine wrapped on iOS (Chrome/FF on
// iOS use WebKit but can't "Add to Home Screen", so we exclude them by UA token).
// iPadOS 13+ reports as "Macintosh", detected via touch support.
const isIosSafari = (): boolean => {
  const ua = window.navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && 'ontouchend' in document)
  const isWebkit = /applewebkit/i.test(ua)
  const isOtherIosBrowser = /crios|fxios|edgios|opios|mercury/i.test(ua)
  return isIos && isWebkit && !isOtherIosBrowser
}

// Resolved synchronously at mount so an already-captured install event (or
// Safari, which fires no event) is reflected without a set-state-in-effect.
const initialKind = (): InstallKind => {
  if (isStandalone()) return 'none'
  if (capturedEvent()) return 'prompt'
  return isIosSafari() ? 'ios' : 'none'
}

export const useInstallPrompt = () => {
  const [kind, setKind] = useState<InstallKind>(initialKind)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(capturedEvent)

  useEffect(() => {
    if (isStandalone()) return

    // Stash captured by the inline script AFTER mount (event fired late).
    const onCaptured = () => {
      const event = capturedEvent()
      if (event) {
        setDeferred(event)
        setKind('prompt')
      }
    }
    // Direct fallback in case the inline capture script is absent.
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      window.__feelioBIP = event as BeforeInstallPromptEvent
      setDeferred(event as BeforeInstallPromptEvent)
      setKind('prompt')
    }
    const onInstalled = () => {
      window.__feelioBIP = null
      setDeferred(null)
      setKind('none')
    }

    window.addEventListener('feelio-bip-ready', onCaptured)
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('feelio-bip-ready', onCaptured)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return
    try {
      await deferred.prompt()
      await deferred.userChoice
    } finally {
      // The event can only be used once, regardless of the user's choice.
      window.__feelioBIP = null
      setDeferred(null)
      setKind('none')
    }
  }, [deferred])

  return { kind, promptInstall }
}
