import { useState, useCallback, useRef } from 'react'
import { Maybe } from 'common/types'

export type ElementMeasurement = {
  clientWidth: number,
  scrollWidth: number,
}

export type UseElementMeasurementHookInterface = {
  measurement: Maybe<ElementMeasurement>,
  onSetRef: (element: HTMLElement) => void,
  remountCount: number,
}

export default function useElementMeasurement(): UseElementMeasurementHookInterface {
  const [measurement, onSetMeasurement] = useState(null)
  const remountCount = useRef(0)
  const onSetRef = useCallback((node: HTMLElement) => {
    if (node !== null) {
      remountCount.current++
      const newMeasurement: ElementMeasurement = {
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
      }
      onSetMeasurement(newMeasurement)
    } else {
      onSetMeasurement(null)
    }
  }, [])
  return {
    measurement,
    onSetRef,
    remountCount: remountCount.current,
  }
}
