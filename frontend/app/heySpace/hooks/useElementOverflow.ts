import {
  useState, useRef, RefObject, useLayoutEffect, useEffect, useCallback
} from 'react'
import { ElementMeasurement } from './useElementMeasurement'
import usePrevious from 'common/hooks/usePrevious'

export type UseElementOverflowHookInterface = {
  isOverflow: boolean,
  targetRef: RefObject<HTMLDivElement>,
}

export default function useElementOverflow<T>(triggerProp: T): UseElementOverflowHookInterface {
  const targetRef = useRef<HTMLDivElement>()
  const [isOverflow, onSetIsOverflow] = useState(false)
  const prevTriggerProp = usePrevious(triggerProp)

  const checkOverflow = useCallback(() => {
    if (!targetRef.current) {
      return
    }
    const isTextOverflowElement = isTextOverflow({
      clientWidth: targetRef.current.clientWidth,
      scrollWidth: targetRef.current.scrollWidth
    })

    if (isTextOverflowElement !== isOverflow) {
      onSetIsOverflow(isTextOverflowElement)
    }
  }, [isOverflow, targetRef.current, onSetIsOverflow])

  useLayoutEffect(() => {
    checkOverflow()
  }, [checkOverflow])

  useEffect(() => {
    if (prevTriggerProp && prevTriggerProp !== triggerProp) {
      checkOverflow()
    }
  }, [
    triggerProp,
    prevTriggerProp,
    checkOverflow
  ])

  return {
    isOverflow,
    targetRef,
  }
}

const isTextOverflow = (measurement: ElementMeasurement) => {
  if (!measurement) {
    return false
  }
  return measurement.clientWidth < measurement.scrollWidth
}
