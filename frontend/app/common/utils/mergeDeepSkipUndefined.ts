import { Map } from 'immutable';

export const mergeDeepSkipUndefined = (oldImmutableMap: Map<any, any>, newImmutableMap: Map<any, any>) => {
  return oldImmutableMap.mergeDeepWith((oldVal: any, newVal: any, key: any) => {
    if (typeof newVal === 'undefined') {
      return oldVal
    }

    return newVal
  }, newImmutableMap)
}
