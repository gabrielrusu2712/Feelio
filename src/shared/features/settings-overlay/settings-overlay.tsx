import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { changePasswordThunk, logoutThunk, selectAuthError } from '@/auth/data-access/store'
import { selectUsername } from '@/user/data-access/store'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import type { ThemeMode } from '@/core/providers/theme-provider/color-mode-context'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'
import {
  Backdrop,
  ChoiceButton,
  CloseButton,
  Dialog,
  Field,
  Form,
  Header,
  Input,
  Note,
  PrimaryButton,
  Row,
} from '@/shared/features/settings-overlay/settings-overlay.styled'

// Fixed backdrop blur strength (px).
const BACKDROP_BLUR = 3
const THEME_MODES: ThemeMode[] = ['auto', 'light', 'dark']

interface SettingsOverlayProps {
  onClose: () => void
}

const SettingsOverlay = (props: SettingsOverlayProps) => {
  const { onClose } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const username = useAppSelector(selectUsername)
  const authError = useAppSelector(selectAuthError)
  const { themeMode, setThemeMode } = useColorMode()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Fixed backdrop blur (the backdrop reads --app-blur).
  useEffect(() => {
    document.documentElement.style.setProperty('--app-blur', `${BACKDROP_BLUR}px`)
  }, [])

  // Close on Escape.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    void dispatch(changePasswordThunk({ currentPassword, newPassword }))
  }

  const handleLogout = () => {
    void dispatch(logoutThunk())
    onClose()
  }

  return createPortal(
    <Backdrop onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={t('settings.title')}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <h2>{t('settings.title')}</h2>
          <CloseButton type="button" onClick={onClose} aria-label={t('settings.close')}>
            ✕
          </CloseButton>
        </Header>

        <Field>
          <span>{t('settings.username')}</span>
          <strong>{username ?? '—'}</strong>
          <Note>{t('settings.usernameNote')}</Note>
        </Field>

        <Field>
          <span>{t('settings.theme')}</span>
          <Row>
            {THEME_MODES.map((mode) => (
              <ChoiceButton
                key={mode}
                type="button"
                $active={themeMode === mode}
                onClick={() => setThemeMode(mode)}
              >
                {t(`settings.theme.${mode}`)}
              </ChoiceButton>
            ))}
          </Row>
        </Field>

        <Field>
          <span>{t('settings.language')}</span>
          <Row>
            <LanguageSwitcher />
          </Row>
        </Field>

        <Form onSubmit={handlePasswordSubmit}>
          <span>{t('settings.password.title')}</span>
          <Input
            type="password"
            placeholder={t('settings.password.current')}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            type="password"
            placeholder={t('settings.password.new')}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          {authError && <Note role="alert">{t(authError, { defaultValue: authError })}</Note>}
          <PrimaryButton type="submit">{t('settings.password.submit')}</PrimaryButton>
        </Form>

        <ChoiceButton type="button" $active={false} onClick={handleLogout}>
          {t('common.logout')}
        </ChoiceButton>
      </Dialog>
    </Backdrop>,
    document.body,
  )
}

export default SettingsOverlay
