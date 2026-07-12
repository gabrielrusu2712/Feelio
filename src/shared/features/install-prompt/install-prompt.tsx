import { useTranslation } from 'react-i18next'
import { useInstallPrompt } from '@/shared/data-access/hooks/use-install-prompt'
import {
  Actions,
  Banner,
  DismissButton,
  Icon,
  InstallButton,
  ShareGlyph,
  Text,
} from '@/shared/features/install-prompt/install-prompt.styled'

// App-wide "install Feelio" banner. On Android/desktop it triggers the native
// install dialog; on iOS Safari (which can't be prompted) it shows the manual
// Share → Add to Home Screen hint. Renders nothing when there's nothing to offer.
const InstallPrompt = () => {
  const { t } = useTranslation()
  const { kind, promptInstall, dismiss } = useInstallPrompt()

  if (kind === 'none') return null

  return (
    <Banner role="dialog" aria-label={t('install.title')}>
      <Icon src="/icon-192.png" alt="" aria-hidden="true" />

      <Text>
        <strong>{t('install.title')}</strong>
        {kind === 'ios' ? (
          <span>
            {t('install.iosHintLead')}
            <ShareGlyph
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="M8 7l4-4 4 4" />
              <path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7" />
            </ShareGlyph>
            {t('install.iosHintTail')}
          </span>
        ) : (
          <span>{t('install.subtitle')}</span>
        )}
      </Text>

      <Actions>
        {kind === 'prompt' && (
          <InstallButton type="button" onClick={() => void promptInstall()}>
            {t('install.action')}
          </InstallButton>
        )}
        <DismissButton type="button" onClick={dismiss} aria-label={t('install.dismiss')}>
          ✕
        </DismissButton>
      </Actions>
    </Banner>
  )
}

export default InstallPrompt
