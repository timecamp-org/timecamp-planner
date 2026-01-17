import { fromJS, List } from 'immutable'
import { Reducer } from 'redux'
import * as C from './constants'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

import {
  onFetchProjectViewDataSuccess,
  onFetchConversationViewDataSuccess,
  onFetchProjectTasksDataSuccess
} from '../RequestModel/constants'
import { TagsState } from './types';
import { PayloadAction } from '../../../types';
import { onFetchTaskDetailsSuccess } from '../TasksModel/constants'

const emptyList = List()

const initialState: TagsState = fromJS({
  tagsData: {},
  tagsByObjectId: {},
})

const tagsReducer: Reducer<TagsState, PayloadAction> = (state: TagsState = initialState, action: PayloadAction): TagsState => {
  switch (action.type) {
    case C.onTagCreateSuccess: {
      const { tag } = action.payload.data
      return state.setIn(['tagsData', tag.get('id')], tag)
    }

    case C.onDeleteTagSuccess: {
      const { tagId } = action.payload.data
      return state.deleteIn(['tagsData', tagId])
    }

    case C.onDeleteTagData: {
      const tagId = action.payload
      return state.deleteIn(['tagsData', tagId])
    }

    case C.onUpdateTagName: {
      const { tagId, name } = action.payload
      return state.setIn(['tagsData', tagId, 'name'], name)
    }

    case C.onUpdateTagColor: {
      const { tagId, color } = action.payload
      return state.setIn(['tagsData', tagId, 'color'], color)
    }

    case C.onTagAttachSuccess: {
      const { objectId, tagId } = action.payload.data
      return state
        .updateIn(['tagsByObjectId', objectId], (list) => list ? list.push(tagId) : List([tagId]))
    }
    case C.onTagDetachSuccess: {
      const { objectId, tagId } = action.payload.data
      return state
        .updateIn(['tagsByObjectId', objectId], (list) => list ? list.filter((id) => id !== tagId) : emptyList)
    }
    case C.onBatchTagsData: {
      const tagsData = action.payload
      return state
        .set('tagsData', state.get('tagsData').mergeDeep(tagsData))
    }
    case C.onCreateTagData: {
      const tag = action.payload
      return state
        .setIn(['tagsData', tag.get('id')], tag)
    }
    case C.onUpdateTagData: {
      const tag = action.payload
      return state
        .setIn(['tagsData', tag.get('id')], tag)
    }

    case C.onBatchTags: {
      const { tagsData, tagIdsByObjectIds } = action.payload
      return state
        .set('tagsByObjectId', state.get('tagsByObjectId').mergeDeep(tagIdsByObjectIds))
        .set('tagsData', state.get('tagsData').mergeDeep(tagsData))
    }

    case C.onCreateTagsByObjectId: {
      const { objectId, tagsByObjectId } = action.payload
      return state
        .setIn(['tagsByObjectId', objectId], tagsByObjectId)
    }
    case C.onUpdateTagsByObjectId: {
      const { objectId, tagsByObjectId } = action.payload
      return state
        .setIn(['tagsByObjectId', objectId], tagsByObjectId)
    }

    case onFetchTaskDetailsSuccess:
    case onFetchConversationViewDataSuccess:
    case onFetchProjectTasksDataSuccess:
    case onFetchProjectViewDataSuccess: {
      const { taskTagIds } = action.payload.data
      return state.set('tagsByObjectId', state.get('tagsByObjectId').merge(taskTagIds))
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default: {
      return state
    }
  }
}

export default tagsReducer
