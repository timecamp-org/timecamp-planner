import React, {
  memo,
  MouseEventHandler,
  RefObject,
  FC,
  FocusEventHandler
} from 'react'
import styles from './styles.css'
import objectColorStyles from 'styles/object-colors-styles.css'
import { doNothing } from 'common/utils'

import colors from 'styles/colors.css'
import { useSelector } from 'common/hooks/useSelector'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'

type ChildrenFunction = (...args: string[]) => JSX.Element

type MenuButtonInterface = {
  projectId?: string,
  className?: string,
  buttonShadeClassName?: string,
  isSelected?: boolean,
  isDisabled?: boolean,
  projectColor?: string
  children: ChildrenFunction,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  innerRef?: RefObject<HTMLButtonElement>,
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>,
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>,
  onMouseDown?: MouseEventHandler<HTMLButtonElement>,
  onBlur?: FocusEventHandler,
  onFocus?: FocusEventHandler
}

const defaultProps = {
  isSelected: false,
  isDisabled: false,
  projectColor: colors.wisteriaColor,
  onClick: doNothing,
  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
  onMouseDown: doNothing,
  onBlur: doNothing,
  onFocus: doNothing,
}

const MenuButton: FC<MenuButtonInterface> = (props) => {
  const projectColor = useSelector((state) => selectProjectColor(state, { projectId: props.projectId }))
  return (
    <button
      ref={props.innerRef}
      className={`
      ${props.className || styles.Component}
      ${props.isSelected ? `${styles.selected} ${objectColorStyles.active}` : ''}
      ${props.isDisabled ? styles.disabled : ''}
    `}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onMouseDown={props.onMouseDown}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onClick={props.onClick}
    >
      {props.children(projectColor)}
    </button>
  )
}

MenuButton.defaultProps = defaultProps

export default memo(MenuButton)
