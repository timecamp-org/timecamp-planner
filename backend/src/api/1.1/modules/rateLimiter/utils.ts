export function createDefaultMessageWithTime(after: string): string {
  return `Too many requests from this IP, please try again after ${after}`
}
