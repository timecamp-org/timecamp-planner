import compareVersions from 'compare-versions'

export function isAppVersionCodeNewerThanCurrent(appVersionCode: string): boolean {
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    // TODO: mobile
    return false
  } else {
    return compareVersions(process.env.VERSION, appVersionCode) < 0
  }
}
