import React from 'react'
import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent'
import Component, { ProjectNameInterface } from '.'
import useComponent from './hook'
import styles from './styles.css'
import useElementOverflow from 'hooks/useElementOverflow'

const TooltipedProjectName: React.FC<ProjectNameInterface> = (props) => {
  const hook = useComponent(props)
  const { isOverflow, targetRef } = useElementOverflow(hook.projectName)
  return (
    <TooltipedHoveredComponent
      className={styles.ellipsized}
      targetInnerClassName={styles.ellipsized}
      message={hook.projectName}
      isTooltipVisible={isOverflow}
      targetRef={targetRef}
    >
      <Component {...props} />
    </TooltipedHoveredComponent>
  )
}

export default TooltipedProjectName
