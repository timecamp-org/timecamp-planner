import { isDate } from 'lodash'
import { TimeService } from '../api/1.1/modules/common/time/TimeService'
import { Request } from 'express';
import { RawResponseClasses } from './types';

const timeService = new TimeService()
// TODO: move to i18n module later
const DEFAULT_LANG = 'en'
const acceptedLanguages = ['pl', 'en']

export function parseDateToEpochInMS(data) {
  let result
  const dataType = typeof data
  const isArray = Array.isArray(data)

  if (dataType === 'object' && data) {
    result = isArray ? [] : {}
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[key]

      result[key] = parseValue(value)
    }
  } else {
    result = data
  }

  return result
}

function parseValue(value) {
  const type = typeof value

  if (isDate(value)) {
    return timeService.getTimeFromDate(value)
  } else if (type === 'object') {
    return parseDateToEpochInMS(value)
  } else {
    return value
  }
}

export function getFirstAcceptedLanguage(req: Request): string {
  let lang = req.acceptsLanguages(...acceptedLanguages)
  if (!lang) {
    lang = DEFAULT_LANG
  }

  return lang
}

export function isRawResponseClass(body: any): boolean {
  const matchingConstructor = RawResponseClasses.includes(body.constructor)
  const matchingClassInheritance = RawResponseClasses.find(responseClass => body.constructor.prototype instanceof responseClass)
  return Boolean(matchingConstructor || matchingClassInheritance)
}
