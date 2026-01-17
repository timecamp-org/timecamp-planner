import { Maybe, UrlConfigInterface } from 'common/types'
import { getFirstProjectUrl } from './getFirstProjectUrl'

export default (data: UrlConfigInterface = {}): Maybe<string> => {
  const firstProjectData = data?.firstProjectData
  return getFirstProjectUrl(firstProjectData)
}
