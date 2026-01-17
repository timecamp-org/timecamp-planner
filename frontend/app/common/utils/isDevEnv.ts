export default function isDev(): boolean {
  return process.env.NODE_ENV === "development" || (typeof __DEV__ !== 'undefined' && __DEV__ === true)
}
