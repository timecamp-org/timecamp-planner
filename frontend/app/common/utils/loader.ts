import { black20Color } from '../commonStyles/colors'

const defaultOptions = { withBackdrop: false }

export function startLoader(options = defaultOptions) {
  const loadingEvent = new CustomEvent('appLoading', options.withBackdrop ? { detail: { style: `background-color: ${black20Color};` } } : null)
  document.dispatchEvent(loadingEvent)
}

export function stopLoader() {
  const loadedEvent = new Event('appLoaded')
  document.dispatchEvent(loadedEvent)
}
