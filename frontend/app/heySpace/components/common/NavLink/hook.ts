import {
  MouseEventHandler, MouseEvent, useCallback, useMemo
} from 'react'
import { useRouteMatch, useHistory } from 'react-router'
import { NavLinkInterface } from '.'

export type NavLinkHookInterface = {
  isActive: boolean,
  onClick: MouseEventHandler<HTMLDivElement>,
}

export function useComponent(props: NavLinkInterface): NavLinkHookInterface {
  const {
    isDisabled,
    to
  } = props
  const history = useHistory()
  const routeMatch = useRouteMatch({ path: to, exact: true, sensitive: false })
  const isActive = useMemo(() => routeMatch && routeMatch.url === to, [routeMatch, to])

  const onClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return
    }
    history.push(to)
    props.onClick(event)
  }, [to, isDisabled, props.onClick])

  return {
    isActive,
    onClick
  }
}
