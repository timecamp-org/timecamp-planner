import { useSelector } from 'common/hooks/useSelector'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectTagList } from 'common/models/domain/TagsModel/selectors'
import { TagInterface, TagsData } from 'common/models/domain/TagsModel/types'
import { selectTagsData } from 'common/models/domain/TagsModel/selectors/domain'
import { selectHasAccessToTags } from 'common/models/domain/SubscriptionLimitsModel/selectors'
import { List } from 'immutable'
import { Id } from 'common/utils/identifier'
import { onTagAssign, onTagAttach, onTagDetach } from 'common/models/domain/TagsModel/actions'
import { TagsInputInterface } from '.'

interface DataProviderHookInterface {
  tags: List<TagInterface>
  tagsData: TagsData
  hasAccessToTags: boolean
}

export const useDataProvider = (props: TagsInputInterface): DataProviderHookInterface => ({
  tags: useSelector((state) => selectTagList(state, { objectId: props.objectId })),
  tagsData: useSelector(selectTagsData),
  hasAccessToTags: useSelector(selectHasAccessToTags)
})

interface DataPersisterHookInterface {
  onTagAttach: (tagId: Id) => void
  onTagDetach: (tagId: Id) => void
  onTagAssign: (name: string) => void
}

export const useDataPersister = (props: TagsInputInterface): DataPersisterHookInterface => {
  const dispatch = useDispatch()
  return {
    onTagAttach: useCallback(
      (tagId: Id) => dispatch(onTagAttach(props.objectId, tagId)),
      [dispatch]
    ),
    onTagDetach: useCallback(
      (tagId: Id) => dispatch(onTagDetach(props.objectId, tagId)),
      [dispatch]
    ),
    onTagAssign: useCallback(
      (name: string) => dispatch(onTagAssign(props.objectId, name)),
      [dispatch]
    ),

  }
}
