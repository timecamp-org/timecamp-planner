import React from 'react'
import { useComponent } from 'components/menu/CurrentWorkspaceInfo/hook'
import styles from './styles.css'

export type CurrentWorkspaceInfoInterface = {
  className?: string,
}

const CurrentWorkspaceInfo: React.FC<CurrentWorkspaceInfoInterface> = (props) => {
  const hook = useComponent()
  return (
    <div className={props.className || styles.component}>{hook.currentWorkspaceName}</div>
  )
}

export default CurrentWorkspaceInfo
