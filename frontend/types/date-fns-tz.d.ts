declare module 'date-fns-tz' {
  import { Locale } from 'date-fns'
  export function utcToZonedTime(date: Date | number | string, timeZone: string): Date
  export function zonedTimeToUtc(date: Date | number | string, timeZone: string): Date
  export function format(
    date: Date | number,
    formatString: string,
    options?: { timeZone?: string; locale?: Locale }
  ): string
}
