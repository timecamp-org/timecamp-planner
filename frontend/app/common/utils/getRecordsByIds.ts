import { List, Map } from 'immutable'
import { Id } from './identifier';

export default function<T>(ids: List<Id>, records: Map<Id, T>): List<T> {
  let result = List() as List<T>

  ids.forEach(id => {
    result = result.push(records.get(id))
  })

  return result
}
