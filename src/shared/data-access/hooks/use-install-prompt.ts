import { useCallback, useEffect, useState } from 'react'
import { getItem, setItem, STORAGE_KEYS } from '@/shared/data-access/utils/local-storage'

// The install banner adapts to the platform:
//  - 'prompt' → Chromium (Android/desktop) fired `beforeinstallprompt`, so we can
//    trigger the native install dialog from our own button.
//  - 'ios'    → Safari on iPhone/iPad, which NEVER fires that event; the only way
//    to install is the manual Share → "Add to Home Screen", so we show a hint.
//  - 'none'   → nothing to offer (already installed, dismissed, or unsupported).
export type InstallKind = 'none' | 'prompt' | 'ios'

// Chromium's non-standard install event (not in the DOM lib types).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// True when the app is already running as an installed PWA (so never nag).
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

// Initial banner state, resolved synchronously at mount. Safari fires no install
// event, so the iOS hint has to be decided here rather than in an effect.
const initialKind = (): InstallKind => {
  if (getItem<boolean>(STORAGE_KEYS.INSTALL_DISMISSED) === true) return 'none'
  if (isStandalone()) return 'none'
  return isIosSafari() ? 'ios' : 'none'
}

export const useInstallPrompt = () => {
  const [kind, setKind] = useState<InstallKind>(initialKind)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (getItem<boolean>(STORAGE_KEYS.INSTALL_DISMISSED) === true) return
    if (isStandalone()) return

    const onBeforeInstall = (event: Event) => {
      // Stop Chromium's mini-infobar; we surface our own button instead.
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setKind('prompt')
    }
    const onInstalled = () => {
      setDeferred(null)
      setKind('none')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
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
      setDeferred(null)
      setKind('none')
    }
  }, [deferred])

  const dismiss = useCallback(() => {
    setItem<boolean>(STORAGE_KEYS.INSTALL_DISMISSED, true)
    setKind('none')
  }, [])

  return { kind, promptInstall, dismiss }
}
