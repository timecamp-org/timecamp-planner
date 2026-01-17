import React, { ReactElement } from 'react'
import { i18n, i18mark } from 'i18n'
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement'
import { useComponent } from './hook'

export interface TooltipedDisabledFreePlanElementInterface {
  disabledMessage?: string,
  className?: string,
  children: (props) => ReactElement,
}

const TooltipedDisabledFreePlanElement: React.FC<TooltipedDisabledFreePlanElementInterface> = ({ children, ...props }) => {
  const { isDisabled } = useComponent()

  return (
    <TooltipedDisabledElement
      isDisabled={isDisabled}
      className={props.className}
      message={i18n.t(props.disabledMessage)}
    >
      {children(isDisabled)}
    </TooltipedDisabledElement>
  )
}

TooltipedDisabledFreePlanElement.defaultProps = {
  disabledMessage: i18mark(`This feature is available only for premium plan`),
}

export default TooltipedDisabledFreePlanElement
