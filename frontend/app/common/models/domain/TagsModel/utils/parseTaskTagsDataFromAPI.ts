import { ParsedTagsInterface, TagInterface, TagsByObjectId } from '../types'
import { List, Map } from 'immutable'
import { Id } from 'common/utils/identifier'
import { Tag } from '../models'

const emptyMap = Map()
const emptyList = List()

export function parseTaskTagsDataFromAPI(tagsDataFromAPI: TagsByObjectId): ParsedTagsInterface {
  let tagsData = emptyMap as Map<Id, TagInterface>
  let tagIdsByObjectIds = emptyMap as Map<Id, List<Id>>

  Object.keys(tagsDataFromAPI).forEach(taskId => {
    const taskTagsData = tagsDataFromAPI[taskId]
    let taskTagsIds = emptyList as List<Id>
    taskTagsData.forEach(tagData => {
      const { id } = tagData
      const immutableTag = Tag(tagData)
      tagsData = tagsData.set(id, immutableTag)
      taskTagsIds = taskTagsIds.push(id)
    })

    tagIdsByObjectIds = tagIdsByObjectIds.set(taskId, taskTagsIds)
  })

  return {
    tagsData,
    tagIdsByObjectIds,
  }
}
