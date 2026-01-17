
export const defaultDebounceTime = 4000
export const toggleDebounceTime = 2000
export const shortDebounceTime = 500


export function generateTimeBetween(from: number, to: number): number {
  return Math.floor((Math.random() * to) + from)
}
