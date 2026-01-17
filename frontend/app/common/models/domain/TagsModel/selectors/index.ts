import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import { List, Map } from 'immutable'

import { selectProjectTaskIds } from '../../TasksModel/selectors/domain'
import { selectTagsData, selectTagsByObjectId } from './domain'
import { Id } from '../../../../utils/identifier';
import { TagInterface, GroupedTagsByLetterInterface, TagsByLetter, TaskIdsByTagIds, TagTaskIds } from '../types';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { getUniqueTagIdsForTaskIds } from '../utils'
import { EMPTY_FILTER_OPTION, SortOrder } from 'models/component/FiltersModel/types'
import { compareString } from 'common/utils/sort'

const emptyList = List<Id>()
const emptyTagList = List<TagInterface>()
const emptyStringMap = Map<Id, string>()

// args: tagId
export const selectTag = createCachedSelector(
  selectTagsData,
  (_, args) => args.tagId,
  (tagsData, tagId) => tagsData.get(tagId),
)
  (
    (_, args) => generateSelectorName(args, ['tagId']),
  )

// args: tagId
export const selectTagNameById = createCachedSelector(
  selectTag,
  (tag) => (tag ? tag.name || '' : ''),
)
  (
    (_, args) => generateSelectorName(args, ['tagId']),
  )

// args: tagId
export const selectTagColorById = createCachedSelector(
  selectTag,
  (tag) => (tag ? tag.color || '' : ''),
)
  (
    (_, args) => generateSelectorName(args, ['tagId']),
  )

// args: name
export const selectTagByName = createCachedSelector(
  selectTagsData,
  (_, args) => args.name,
  (tagsData, name) => tagsData.find(t => t.name === name),
)
  (
    (_, args) => generateSelectorName(args, ['name']),
  )

// args: objectId
export const selectTagsIdsList = createCachedSelector(
  selectTagsByObjectId,
  (_, args) => args.objectId,
  (tagsByObjectId, objectId) => tagsByObjectId.get(objectId) || emptyList,
)
  (
    (_, args) => generateSelectorName(args, ['objectId']),
  )

// args: objectId
export const selectTagList = createCachedSelector(
  selectTagsData,
  selectTagsIdsList,
  (tagsData, tagsIds) => {
    let result = emptyTagList
    if (tagsIds) {
      tagsIds.forEach(id => {
        const tagData = tagsData.get(id)
        if (tagData) {
          result = result.push(tagData)
        }
      })
    }
    return result
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId']),
  )

// args: objectId
export const selectTagListCount = createCachedSelector(
  selectTagsIdsList,
  (tagsIds) => tagsIds.size,
)
  (
    (_, args) => generateSelectorName(args, ['objectId']),
  )

// args: projectId
export const selectProjectTasksTags = createCachedSelector(
  selectProjectTaskIds,
  selectTagsByObjectId,
  (taskIds, tagsByObjectId) => getUniqueTagIdsForTaskIds(taskIds, tagsByObjectId).push(EMPTY_FILTER_OPTION),
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

// args: projectId
export const selectSortedProjectTasksTags = createCachedSelector(
  selectProjectTasksTags,
  selectTagsData,
  (tagIds, tagsData) => tagIds.sort((tagIdA, tagIdB) => {
    const tagNameA = tagsData.getIn([tagIdA, 'name'])
    const tagNameB = tagsData.getIn([tagIdB, 'name'])

    return compareString(tagNameA, tagNameB, SortOrder.ASC)
  }) as List<Id>
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

export const selectTagNamesByTagIds = createSelector(
  selectTagsData,
  (tagsData): Map<Id, string> => {
    let tagNamesByTagIds = emptyStringMap
    tagsData.valueSeq().forEach(tag => {
      tagNamesByTagIds = tagNamesByTagIds.set(tag.id, tag.name)
    })
    return tagNamesByTagIds
  }
)

export const selectAllCurrentUserAccessibleTagsInOrder = createSelector(
  selectTagsData,
  selectTagsByObjectId,
  selectTagNamesByTagIds,
  (tagsData, tagIdsByObjectIds, tagNamesByTagIds) => {
    let result = tagsData
      .map(() => emptyList) as Map<string, List<Id>>

    // convert tasks -> tags map to tags -> tasks
    tagIdsByObjectIds.forEach((tagIds, taskId) => {
      tagIds.forEach(tagId => {
        if (tagsData.get(tagId)) { // handle case when tag is deleted from redux and changes feed didn't send remove tag from tasks update yet
          if (result.get(tagId) === undefined) {
            result = result
              .set(tagId, emptyList.push(taskId))
          } else {
            result = result
              .set(tagId, result.get(tagId).push(taskId))
          }
        }
      })
    })

    // 1. sort descending by number of tasks tag is used in
    // 2. group by tag first letter
    // 3. sort tags groups alphabetically
    // 4. convert data to be renderable by react
    return result
      .sort((a, b) => b.size - a.size)
      .groupBy((taskIds, tagId) => {
        const tagFirstLetter = (tagNamesByTagIds.get(tagId) || '')[0] || ''
        return tagFirstLetter.toLowerCase()
      })
      .sortBy((_, tagNameFirstLetter) => tagNameFirstLetter)
      .entrySeq()
      .toList()
      .map((tagsByLetter: TagsByLetter) => Map({
        firstLetter: tagsByLetter[0],
        tagsTaskIds: tagsByLetter[1]
          .entrySeq()
          .toList()
          .map((taskIdsByTagIds: TaskIdsByTagIds) => Map({
            tagId: taskIdsByTagIds[0],
            taskIds: taskIdsByTagIds[1],
          })) as List<TagTaskIds>
      })) as List<GroupedTagsByLetterInterface>
  },
)

// args: projectId
export const selectVisibleProjectTaskTags = createCachedSelector(
  selectSortedProjectTasksTags,
  (_, args) => args.maxItemsCount,
  (projectTasksTags, maxItemsCount) => projectTasksTags.slice(0, maxItemsCount) as List<Id>,
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )

// args: projectId
export const selectHiddenProjectTaskTagsCount = createCachedSelector(
  selectSortedProjectTasksTags,
  selectVisibleProjectTaskTags,
  (projectTasksTags, visibleProjectTaskTags) => projectTasksTags.size - visibleProjectTaskTags.size,
)
  (
    (_, args) => generateSelectorName(args, ['projectId']),
  )