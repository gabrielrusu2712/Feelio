import i18n from 'i18next'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'

// The i18n instance is a shared singleton; pin it to English around each test
// so the switch direction is deterministic and no state leaks between tests.
beforeEach(async () => {
  await i18n.changeLanguage('en')
})
afterEach(async () => {
  await i18n.changeLanguage('en')
})

describe('LanguageSwitcher', () => {
  it('offers the other language and switches to it on click', async () => {
    const { user } = renderWithProviders(<LanguageSwitcher />)

    // Current language is English → the button offers Romanian.
    await user.click(screen.getByRole('button', { name: /Română/ }))

    // After switching, i18n is Romanian and the button now offers English back.
    expect(await screen.findByRole('button', { name: /English/ })).toBeInTheDocument()
    expect(i18n.language).toBe('ro')
  })
})
