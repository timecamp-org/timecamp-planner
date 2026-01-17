import { detect } from 'detect-browser'

export default () => {
  const browser = detect()
  if (!browser) {
    return false
  }

  switch (browser.os.toLowerCase()) {
    case 'ios':
    case 'android os':
    case 'windows mobile': {
      return true
    }
    default: {
      return false
    }
  }
}