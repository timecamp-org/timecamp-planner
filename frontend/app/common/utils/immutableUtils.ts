import { Set, Map, List } from 'immutable'
import { Id } from './identifier';
import { AnyDict, Maybe } from 'common/types';
import { BaseEntity } from 'models/domain/EntityModel/types';

const emptyMap = Map()
const emptyList = List()

export function mergeLists<T>(list: List<T>, newList: List<T>): List<T> {
  return Set(list).union(Set(newList)).toList()
}

export function mergeObjectLists<T>(objectLists: Map<Id, List<T>>, newObjectLists: Map<Id, List<T>>): Map<Id, List<T>> {
  let mergedObjectLists = emptyMap as Map<Id, List<T>>
  newObjectLists.forEach((list, objectId) => {
    const oldList = objectLists.get(objectId)
    mergedObjectLists = mergedObjectLists.set(objectId, mergeLists(oldList, list))
  })
  return objectLists.mergeDeep(mergedObjectLists)
}

export function pushUniqToList<T>(list: List<T>, item: T): List<T> {
  if (!list) {
    return List([item])
  }

  if (!list.includes(item)) {
    list = list.push(item)
  }

  return list
}

export function filterList<T>(list: List<T>, item: T): Maybe<List<T>> {
  if (!list) {
    return null
  }

  return list.filter(listItem => listItem !== item) as List<T>
}

export function filterLists<T>(list: List<T>, itemsToRemove: List<T> = emptyList as List<T>): Maybe<List<T>> {
  if (!list) {
    return null
  }

  return list.filterNot(listItem => itemsToRemove.includes(listItem)) as List<T>
}

export function removeIdFromList(idToRemove: Id): (list: List<Id>) => Maybe<List<Id>> {
  return (list: List<Id> = emptyList as List<Id>): List<Id> => filterList(list, idToRemove)
}

export function updateListWithNewItem<T>(itemToAdd: T) {
  return (list = emptyList as List<T>): List<T> => list.includes(itemToAdd)
    ? list
    : list.push(itemToAdd)
}

export function getMapOfRecords<T extends BaseEntity, R>(entities: T[], Constructor: (entity: T) => R): Map<Id, R> {
  let recordsMap = Map<Id, R>()
  entities.forEach(entity => {
    recordsMap = recordsMap.set(entity.id, Constructor(entity))
  })
  return recordsMap
}

export function recordMergerFactory<RecordPropType, RecordInterface extends AnyDict>(basicKeys: (keyof RecordInterface)[]) {
  return (
    oldVal: RecordPropType,
    newVal: RecordPropType,
    key: keyof RecordInterface,
  ): RecordPropType => {
    if (basicKeys.includes(key) || oldVal === undefined) {
      return newVal
    } else {
      return oldVal
    }
  }
}

export function mergeIfExists(source: Map<Id, any>, data: Map<Id, any>, containsLists: boolean = false): Map<Id, any> {
  if (!source) {
    return null
  }

  if (!data) {
    return source
  }

  if (containsLists) {
    return mergeObjectLists(source, data)
  }
  return source.mergeDeep(data)
}
