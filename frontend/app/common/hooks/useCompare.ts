import usePrevious from './usePrevious'
import isObject from 'lodash/isObject'
import isEqual from 'lodash/isEqual'
import { Map, List, is } from 'immutable'

export default function useCompare<T>(value: T): boolean {
  const prevValue = usePrevious<T>(value)
  if (Map.isMap(value) || List.isList(value)) {
    return is(prevValue, value)
  } else if (isObject(value)) {
    return !isEqual(prevValue, value)
  }
  return prevValue !== value
}
