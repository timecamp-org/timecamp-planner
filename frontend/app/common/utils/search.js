import { List } from 'immutable'

const emptyList = new List()

export function searchByKeys(keyValueMap, searchText) {
  let matchKeys = emptyList
  keyValueMap
    .forEach((value, key) => {
      if (value.toUpperCase().startsWith(searchText.toUpperCase())) {
        matchKeys = matchKeys.push(key)
      }
    })

  return matchKeys
}