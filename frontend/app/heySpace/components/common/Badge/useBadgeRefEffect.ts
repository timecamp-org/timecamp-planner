import { useEffect, RefObject, useContext } from 'react'
import usePrevious from 'common/hooks/usePrevious'
import { BadgeContainerType } from './types'
import { LeftMenuUnreadsContext } from 'components/menu/LeftMenuUnreadsController/context'

export interface BadgeRefEffectHookInterface {
  objectId: string,
  counter: number,
  innerRef: RefObject<HTMLDivElement>,
}

export const useBadgeRefEffect = (props: BadgeRefEffectHookInterface): void => {
  const prevCounterValue = usePrevious(props.counter)
  const context = useContext(LeftMenuUnreadsContext)

  useEffect(() => {
    if (context.onSetBadgeComponentRef && context.onRemoveBadgeRefFromUnreadList) {
      context.onSetBadgeComponentRef(props.objectId, props.counter, props.innerRef.current, BadgeContainerType.CONVERSATION)
      return () => context.onRemoveBadgeRefFromUnreadList(props.objectId)
    }

    return null
  }, [])

  useEffect(() => {
    if (prevCounterValue > 0 && props.counter < 1 && context.onRemoveBadgeRefFromUnreadList) {
      context.onRemoveBadgeRefFromUnreadList(props.objectId)
    }
    if (prevCounterValue < 1 && props.counter > 0 && context.onSetBadgeComponentRef) {
      context.onSetBadgeComponentRef(props.objectId, props.counter, props.innerRef.current, BadgeContainerType.SPACE)
    }
  }, [
    props.counter,
    props.objectId,
    prevCounterValue,
    context.onSetBadgeComponentRef,
    context.onRemoveBadgeRefFromUnreadList
  ])
}
