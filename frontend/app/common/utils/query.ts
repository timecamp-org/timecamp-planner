import { localStorage } from '../services'
import handleError from './handleError'

export type QueryStringWithUTMInterface = {
  utm_source: string,
  ref: string,
  referrer: string,
}

export function getRegistrationParamsFromUrl(parsedQueryString: QueryStringWithUTMInterface) {
  if (!parsedQueryString) {
    return
  }
  
  let { utm_source, ref, referrer } = parsedQueryString

  if (utm_source && utm_source.length > 0) {
    localStorage.setItem('__utm_source', utm_source, handleErrorIfExists)
  }

  if (!ref || ref.length === 0) {
    ref = document.referrer || referrer
  }

  if (ref && ref.length > 0) {
    localStorage.setItem('__referrer', ref, handleErrorIfExists)
  }
}

function handleErrorIfExists(error: Error): void {
  if (error) {
    handleError(error)
  }
}