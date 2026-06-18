export const USERNAME_COOLDOWN_DAYS = 30

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Days the user must still wait before changing their username again, or null
// if they are free to change it now (no prior change, or the cooldown elapsed).
export const daysUntilUsernameChange = (
  lastChange: Date | null,
  now: Date = new Date(),
): number | null => {
  if (!lastChange) return null

  const elapsedDays = (now.getTime() - lastChange.getTime()) / MS_PER_DAY

  return elapsedDays < USERNAME_COOLDOWN_DAYS
    ? Math.ceil(USERNAME_COOLDOWN_DAYS - elapsedDays)
    : null
}

export const canChangeUsername = (lastChange: Date | null, now: Date = new Date()): boolean =>
  daysUntilUsernameChange(lastChange, now) === null
