import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { TagsByObjectId } from '../types'
import { mergeLists } from 'common/utils/immutableUtils'

const emptyList = List<Id>()

export function getUniqueTagIdsForTaskIds(taskIds: List<Id>, tagsByObjectId: TagsByObjectId): List<Id> {
  if (taskIds && tagsByObjectId) {
    let tagIds = emptyList
    taskIds.forEach(taskId => {
      const taskTagIds = tagsByObjectId.get(taskId) || emptyList
      tagIds = mergeLists(tagIds, taskTagIds)
    })
    return tagIds
  } else {
    return emptyList
  }
}