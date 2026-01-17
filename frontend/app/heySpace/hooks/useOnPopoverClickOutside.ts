import { ReactEventHandler, RefObject, useEffect } from 'react'

export default function useOnPopoverClickOutside(ref: RefObject<HTMLElement>, handler: ReactEventHandler) {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current) {
          return
        } else {
          const popoverRoot = document.getElementById('popper-root')
          if (ref.current.contains(event.target) || popoverRoot.contains(event.target)) {
            return
          }
        }

        handler(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, handler] // handler should be wrapped in useCallback to avoid recreating event listeners on every rerender
  )
}
