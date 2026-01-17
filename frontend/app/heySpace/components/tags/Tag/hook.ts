import { selectTagNameById, selectTagColorById } from 'models/domain/TagsModel/selectors'
import useOnHover from 'hooks/useOnHover'
import { MouseEventHandler, MouseEvent, useCallback } from 'react'
import { TagInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'

export type TagHookInterface = {
  tagName: string,
  tagColor: string,
  isHovering: boolean,
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
  onRemoveTag: (event: MouseEvent) => void,
}

export function useComponent(props: TagInterface): TagHookInterface {
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover<HTMLDivElement>()

  const onRemoveTag = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    props.onRemoveTag(props.tagId)
  }, [props.tagId])

  return {
    isHovering,
    tagName: useSelector(state => selectTagNameById(state, { tagId: props.tagId })),
    tagColor: useSelector(state => selectTagColorById(state, { tagId: props.tagId })),

    onMouseEnter,
    onMouseLeave,
    onRemoveTag,
  }
}
