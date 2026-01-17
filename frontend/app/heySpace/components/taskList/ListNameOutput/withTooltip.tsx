import React from 'react'
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent'
import Component, { ListNameOutputInterface } from '.'
import styles from './styles.css'
import useComponent from './hook'
import useElementOverflow from 'hooks/useElementOverflow'

const TooltipedListNameOutput: React.FC<ListNameOutputInterface> = (props) => {
  const hook = useComponent(props)
  const { isOverflow, targetRef } = useElementOverflow(hook.listName)
  return (
    <TooltipedHoveredComponent
      className={styles.ellipsized}
      targetInnerClassName={styles.ellipsized}
      message={hook.listName}
      isTooltipVisible={isOverflow}
      targetRef={targetRef}
    >
      <Component {...props} />
    </TooltipedHoveredComponent>
  )
}


export default TooltipedListNameOutput