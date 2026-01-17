import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

const resolveTrue = () => true

export const useRedirect = (
  route: string,
  condition: () => boolean = resolveTrue,
) => {
  const history = useHistory()

  const onRedirect = useCallback(() => {
    history.push(route)
  }, [history, route])

  React.useEffect(() => {
    if (condition()) {
      onRedirect()
    }
  }, [condition, onRedirect])
}
