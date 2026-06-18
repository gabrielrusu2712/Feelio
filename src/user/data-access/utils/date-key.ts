// Canonical daily-bucket key. Every reader of dailyMoods / loginDays / the
// new-day reset MUST derive its key from this one function so node-test and
// browser locales can never silently disagree (matches the source's ro-RO).
const DATE_KEY_LOCALE = 'ro-RO'

export const toDateKey = (date: Date = new Date()): string =>
  date.toLocaleDateString(DATE_KEY_LOCALE)
