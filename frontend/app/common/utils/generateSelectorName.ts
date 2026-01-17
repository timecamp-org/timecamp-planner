import { AnyDict } from "../types";

export default function generateSelectorName(args: AnyDict, acceptedParams: string[]): string {

  function extractValue(param) {
    const value = args[param]
    if (value && typeof value !== 'string') {
      if (Array.isArray(value)) {
        return value.join(':')
      }
      return value
    }
    return value
  }

  if (!acceptedParams || acceptedParams.length === 0) {
    throw new Error('Missing acceptedParams argument')
  }
  
  const generatedKey = acceptedParams
    .map(extractValue)
    .join(':')

  return generatedKey
}
