import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { changePasswordThunk, logoutThunk } from '@/auth/data-access/store'
import {
  changeUsernameThunk,
  selectLastUsernameChange,
  selectUsername,
} from '@/user/data-access/store'
import { daysUntilUsernameChange } from '@/user/data-access/utils/username-cooldown'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import type { ThemeMode } from '@/core/providers/theme-provider/color-mode-context'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'
import {
  Backdrop,
  ChoiceButton,
  CloseButton,
  Dialog,
  Field,
  FieldLabel,
  Form,
  GhostButton,
  Header,
  Input,
  Note,
  PrimaryButton,
  Row,
  Section,
  SectionTitle,
  ValueRow,
} from '@/shared/features/settings-overlay/settings-overlay.styled'

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
  const lastUsernameChange = useAppSelector(selectLastUsernameChange)
  const { themeMode, setThemeMode } = useColorMode()

  // Username rename is managed with local state (not the shared auth error) so a
  // rename failure never leaks into other screens.
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [nameSaved, setNameSaved] = useState(false)
  const [savingName, setSavingName] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Days left on the 30-day rename cooldown (null once free to change).
  const cooldownDays = useMemo(
    () => daysUntilUsernameChange(lastUsernameChange ? new Date(lastUsernameChange) : null),
    [lastUsernameChange],
  )

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

  const startEditingName = () => {
    setNameDraft(username ?? '')
    setNameError(null)
    setNameSaved(false)
    setEditingName(true)
  }

  const cancelEditingName = () => {
    setEditingName(false)
    setNameError(null)
  }

  const handleUsernameSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setNameError(null)
    setSavingName(true)
    try {
      await dispatch(changeUsernameThunk({ desired: nameDraft })).unwrap()
      setEditingName(false)
      setNameSaved(true)
    } catch (error) {
      setNameError(error as string)
    } finally {
      setSavingName(false)
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordSaved(false)
    setSavingPassword(true)
    try {
      await dispatch(changePasswordThunk({ currentPassword, newPassword })).unwrap()
      setCurrentPassword('')
      setNewPassword('')
      setPasswordSaved(true)
    } catch (error) {
      setPasswordError(error as string)
    } finally {
      setSavingPassword(false)
    }
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

        <Section aria-label={t('settings.section.account')}>
          <SectionTitle>{t('settings.section.account')}</SectionTitle>

          <Field>
            <FieldLabel>{t('settings.username')}</FieldLabel>
            {editingName ? (
              <Form onSubmit={handleUsernameSubmit}>
                <Row>
                  <Input
                    autoFocus
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                    placeholder={t('settings.username.placeholder')}
                    aria-label={t('settings.username.placeholder')}
                  />
                  <PrimaryButton type="submit" disabled={savingName}>
                    {t('settings.username.save')}
                  </PrimaryButton>
                  <GhostButton type="button" onClick={cancelEditingName} disabled={savingName}>
                    {t('settings.username.cancel')}
                  </GhostButton>
                </Row>
                {nameError ? (
                  <Note $tone="error" role="alert">
                    {t(nameError, { defaultValue: nameError })}
                  </Note>
                ) : (
                  <Note>{t('settings.username.hint')}</Note>
                )}
              </Form>
            ) : (
              <>
                <ValueRow>
                  <strong>{username ?? '—'}</strong>
                  <GhostButton
                    type="button"
                    onClick={startEditingName}
                    disabled={cooldownDays !== null}
                  >
                    {t('settings.username.edit')}
                  </GhostButton>
                </ValueRow>
                {cooldownDays !== null && (
                  <Note>{t('settings.username.cooldown', { days: cooldownDays })}</Note>
                )}
                {nameSaved && <Note $tone="success">{t('settings.username.success')}</Note>}
              </>
            )}
          </Field>
        </Section>

        <Section aria-label={t('settings.section.appearance')}>
          <SectionTitle>{t('settings.section.appearance')}</SectionTitle>

          <Field>
            <FieldLabel>{t('settings.theme')}</FieldLabel>
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
            <FieldLabel>{t('settings.language')}</FieldLabel>
            <Row>
              <LanguageSwitcher />
            </Row>
          </Field>
        </Section>

        <Section aria-label={t('settings.section.security')}>
          <SectionTitle>{t('settings.section.security')}</SectionTitle>

          <Form onSubmit={handlePasswordSubmit}>
            <FieldLabel>{t('settings.password.title')}</FieldLabel>
            <Input
              type="password"
              placeholder={t('settings.password.current')}
              aria-label={t('settings.password.current')}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <Input
              type="password"
              placeholder={t('settings.password.new')}
              aria-label={t('settings.password.new')}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            {passwordError && (
              <Note $tone="error" role="alert">
                {t(passwordError, { defaultValue: passwordError })}
              </Note>
            )}
            {passwordSaved && <Note $tone="success">{t('settings.password.success')}</Note>}
            <PrimaryButton type="submit" disabled={savingPassword}>
              {t('settings.password.submit')}
            </PrimaryButton>
          </Form>
        </Section>

        <GhostButton type="button" onClick={handleLogout}>
          {t('common.logout')}
        </GhostButton>
      </Dialog>
    </Backdrop>,
    document.body,
  )
}

export default SettingsOverlay
