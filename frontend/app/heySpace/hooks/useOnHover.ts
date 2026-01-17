import { useState, MouseEventHandler, useCallback } from 'react';

export type UseOnHoverHook<T> = {
  isHovering: boolean,
  onMouseEnter: MouseEventHandler<T>,
  onMouseLeave: MouseEventHandler<T>,
}

export default function useOnHover<T>(isHoveringDefault: boolean = false): UseOnHoverHook<T> {
  const [isHovering, onSetIsHovering] = useState(isHoveringDefault)

  const onMouseEnter = useCallback(() => onSetIsHovering(true), [])
  const onMouseLeave = useCallback(() => onSetIsHovering(false), [])

  return {
    isHovering,
    onMouseEnter,
    onMouseLeave,
  }
}
