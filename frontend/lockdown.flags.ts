/**
 * Emergency product lockdown.
 * - Explicit LOCKDOWN_MODE / NEXT_PUBLIC_LOCKDOWN_MODE env wins when set
 * - Otherwise defaults to ON in production builds
 */
export function isLockdownEnabled(): boolean {
  const raw = (
    process.env.LOCKDOWN_MODE ||
    process.env.NEXT_PUBLIC_LOCKDOWN_MODE ||
    ''
  )
    .trim()
    .toLowerCase()

  if (['1', 'true', 'yes', 'on'].includes(raw)) return true
  if (['0', 'false', 'no', 'off'].includes(raw)) return false

  return process.env.NODE_ENV === 'production'
}
