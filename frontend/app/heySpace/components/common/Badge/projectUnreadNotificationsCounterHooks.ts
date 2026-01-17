import { useRef, RefObject } from 'react'
import { DataProviderHookInterface } from './dataHooks'
import { BadgeInterface } from './index'
import { selectProjectUnreadMessagesCount } from '../../../../common/models/domain/NotificationsModel/selectors'
import { selectProjectColor } from '../../../../common/models/domain/ProjectsModel/selectors'
import { useSelector } from 'react-redux'
import { useBadgeRefEffect } from './useBadgeRefEffect'

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  const selectedColor = useSelector(state => selectProjectColor(state, { projectId: props.objectId }))
  const color = props.color || selectedColor
  const counter = useSelector(state => selectProjectUnreadMessagesCount(state, { projectId: props.objectId }))
  const innerRef: RefObject<HTMLDivElement> = useRef();

  useBadgeRefEffect({
    objectId: props.objectId,
    counter,
    innerRef,
  })

  return {
    counter,
    color,
    innerRef
  }
}
