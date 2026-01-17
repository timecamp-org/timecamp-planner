import messages from './restApiErrorMessages'
import stringTemplate from 'string-template'

export function prepareErrorMessageForUser(apiResponse) {
  if (!messages[apiResponse.code]) {
    return undefined
  }
  return stringTemplate(messages[apiResponse.code], apiResponse.params)
}
