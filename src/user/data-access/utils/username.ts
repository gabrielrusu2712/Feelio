// Username rules, shared by registration (auto-suffix) and the settings rename.
// A username is stored twice: the display form (`username`, what the user sees)
// and a normalized key (`usernameLower`, the id of its `usernames/{key}`
// reservation doc). Uniqueness is enforced on the normalized key so casing can
// never smuggle in a duplicate.

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20

// Lowercased, trimmed, invalid characters dropped. This is the reservation key —
// two display names that normalize to the same key collide.
export const normalizeUsername = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')

// Validates the raw (display) input the user typed. Returns an i18n error key
// when invalid, or null when acceptable. Length is measured on the normalized
// key so trailing punctuation can't pad a too-short name.
export const validateUsername = (raw: string): string | null => {
  const normalized = normalizeUsername(raw)

  if (normalized.length < USERNAME_MIN_LENGTH) return 'user.error.usernameTooShort'
  if (normalized.length > USERNAME_MAX_LENGTH) return 'user.error.usernameTooLong'

  return null
}

// Sanitizes an arbitrary seed (e.g. an email local-part) into a valid base
// username, padding with 'feelio' when nothing usable survives normalization.
export const seedUsername = (raw: string): string => {
  const normalized = normalizeUsername(raw).slice(0, USERNAME_MAX_LENGTH)
  return normalized.length >= USERNAME_MIN_LENGTH ? normalized : 'feelio'
}
