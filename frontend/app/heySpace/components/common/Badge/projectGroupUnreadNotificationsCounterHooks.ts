import { useRef, RefObject } from 'react'
import { DataProviderHookInterface } from './dataHooks'
import { BadgeInterface } from './index'
import { useSelector } from 'react-redux'
import { useBadgeRefEffect } from './useBadgeRefEffect'
import { selectProjectGroupUnreadMessagesCount } from 'models/domain/PersonalProjectStructureModel/selectors'

export function useDataProvider(props: BadgeInterface): DataProviderHookInterface {
  const counter = useSelector(state => selectProjectGroupUnreadMessagesCount(state, { groupId: props.objectId }))
  const innerRef: RefObject<HTMLDivElement> = useRef()

  useBadgeRefEffect({
    objectId: props.objectId,
    counter,
    innerRef,
  })

  return {
    counter,
    innerRef
  }
}
